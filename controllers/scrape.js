const axios = require("axios");
const he = require("he");
const News = require("../model/news");
const { uploadImageUrlToCloudinary } = require("../utils/upload");

/* =========================================================
   HELPERS
========================================================= */

// remove script/style/ads wrappers you don't want
function cleanHtml(html = "") {
  if (!html) return "";

  let cleaned = html;

  // remove script tags
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  // remove style tags
  cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

  // remove some common ad blocks / wp injected blocks if present
  cleaned = cleaned.replace(/<ins\b[^>]*class="adsbygoogle"[^>]*>.*?<\/ins>/gis, "");
  cleaned = cleaned.replace(/<div[^>]*class="[^"]*schoo-[^"]*"[^>]*>.*?<\/div>/gis, "");
  cleaned = cleaned.replace(/<div[^>]*data-cfpa="[^"]*"[^>]*>.*?<\/div>/gis, "");

  // decode html entities
  cleaned = he.decode(cleaned);

  return cleaned.trim();
}

// convert HTML to plain text excerpt fallback
function htmlToPlainText(html = "") {
  return he
    .decode(
      html
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    )
    .trim();
}

function buildExcerpt(post) {
  const excerptHtml = post?.excerpt?.rendered || "";
  const contentHtml = post?.content?.rendered || "";

  const excerptText = htmlToPlainText(excerptHtml);
  if (excerptText) return excerptText.slice(0, 250);

  const contentText = htmlToPlainText(contentHtml);
  return contentText.slice(0, 250);
}

function extractCategories(post) {
  try {
    const terms = post?._embedded?.["wp:term"] || [];
    const categories = [];

    for (const group of terms) {
      for (const item of group) {
        if (item.taxonomy === "category" && item.name) {
          categories.push(item.name.trim());
        }
      }
    }

    return [...new Set(categories)];
  } catch (error) {
    return [];
  }
}

function extractFeaturedImage(post) {
  return post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "";
}

/* =========================================================
   SAVE ONE POST
========================================================= */
async function saveSinglePost(post) {
  try {
    const wordpressId = post.id;
    const slug = (post.slug || "").trim().toLowerCase();
    const title = he.decode(post?.title?.rendered || "").trim();
    const content = cleanHtml(post?.content?.rendered || "");
    const excerpt = buildExcerpt(post);
    const category = extractCategories(post);
    const sourceUrl = post.link || "";
    const sourceImageUrl = extractFeaturedImage(post);
    const datePublished = post.date ? new Date(post.date) : null;

    if (!slug || !title || !content) {
      console.log(`Skipping invalid post: ${slug || wordpressId}`);
      return { status: "skipped_invalid", slug };
    }

    // =========================
    // 1) If post already exists by slug or wordpressId -> skip/update
    // =========================
    let existingNews = null;

    if (wordpressId) {
      existingNews = await News.findOne({
        $or: [
          { wordpressId },
          { slug }
        ]
      });
    } else {
      existingNews = await News.findOne({ slug });
    }

    // =========================
    // IMAGE DEDUPE LOGIC
    // =========================
    let finalImage = "";
    let finalImagePublicId = "";

    if (sourceImageUrl) {
      // check if another saved news already used this exact source image
      const existingImageNews = await News.findOne({
        sourceImageUrl
      }).select("image imagePublicId sourceImageUrl");

      if (existingImageNews?.image) {
        finalImage = existingImageNews.image;
        finalImagePublicId = existingImageNews.imagePublicId || "";
        console.log(`♻ Reusing Cloudinary image for slug: ${slug}`);
      } else {
        // upload only if not already uploaded before
        const uploaded = await uploadImageUrlToCloudinary(sourceImageUrl, "news");
        finalImage = uploaded?.secure_url || "";
        finalImagePublicId = uploaded?.public_id || "";
        console.log(`☁ Uploaded image for slug: ${slug}`);
      }
    }

    // =========================
    // UPDATE existing news
    // =========================
    if (existingNews) {
      existingNews.title = title;
      existingNews.content = content;
      existingNews.excerpt = excerpt;
      existingNews.category = category;
      existingNews.sourceUrl = sourceUrl;
      existingNews.datePublished = datePublished;

      if (sourceImageUrl) {
        existingNews.sourceImageUrl = sourceImageUrl;
      }

      // only replace image if we actually got one
      if (finalImage) existingNews.image = finalImage;
      if (finalImagePublicId) existingNews.imagePublicId = finalImagePublicId;

      if (wordpressId) existingNews.wordpressId = wordpressId;

      await existingNews.save();
      console.log(`✏ Updated: ${slug}`);
      return { status: "updated", slug };
    }

    // =========================
    // CREATE new news
    // =========================
    const news = new News({
      wordpressId,
      title,
      slug,
      category,
      image: finalImage,
      imagePublicId: finalImagePublicId,
      sourceImageUrl,
      sourceUrl,
      content,
      excerpt,
      datePublished
    });

    await news.save();
    console.log(`✅ Saved: ${slug}`);
    return { status: "created", slug };

  } catch (error) {
    console.error(`❌ Error saving post ${post?.slug || post?.id}:`, error.message);
    return {
      status: "error",
      slug: post?.slug || "",
      error: error.message
    };
  }
}

/* =========================================================
   SCRAPE PAGE BY PAGE
========================================================= */
const scrapenews = async () => {
  try {
    let page = 6;
    let keepGoing = true;

    let totalCreated = 0;
    let totalUpdated = 0;
    let totalSkipped = 0;
    let totalErrors = 0;

    while (keepGoing) {
      const url = `https://schoolnewsng.com/wp-json/wp/v2/posts?per_page=100&page=${page}&_embed`;

      console.log(`\n📄 Fetching page ${page}...`);

      let response;
      try {
        response = await axios.get(url, {
          timeout: 30000,
          headers: {
            "User-Agent": "Mozilla/5.0"
          }
        });
      } catch (error) {
        // WordPress usually returns 400 if page does not exist
        if (error.response && error.response.status === 400) {
          console.log(`No more pages after page ${page - 1}`);
          break;
        }
        throw error;
      }

      const posts = response.data || [];

      if (!Array.isArray(posts) || posts.length === 0) {
        console.log(`No posts found on page ${page}. Stopping.`);
        break;
      }

      for (const post of posts) {
        const result = await saveSinglePost(post);

        if (result.status === "created") totalCreated++;
        else if (result.status === "updated") totalUpdated++;
        else if (result.status === "skipped_invalid") totalSkipped++;
        else if (result.status === "error") totalErrors++;
      }

      page++;
    }

    return {
      success: true,
      message: "Scraping completed",
      summary: {
        created: totalCreated,
        updated: totalUpdated,
        skipped: totalSkipped,
        errors: totalErrors
      }
    };
  } catch (error) {
    console.error("❌ Scrape failed:", error.message);
    return {
      success: false,
      message: error.message
    };
  }
};

module.exports = { scrapenews };