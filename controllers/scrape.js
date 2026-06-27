const axios = require("axios");
const he = require("he");
const News = require("../model/news");
const { uploadImageUrlToCloudinary } = require("../utils/upload");

const NewsletterSubscriber = require("../model/NewsletterSubscriber");
const { bravo_sendEmail } = require("../services/bravoemail");
const { renderNewsBroadcastTemplate } = require("../template/subscribed");




let unchangedCount = 0;
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



/* =========================
   HELPERS
========================= */
function getNewsImage(image) {
  if (!image) return "https://abaniseedu.com/default-news.jpg";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `https://new.abaniseedu.com/${image}`;
}

async function sendNewsToSubscribers(newsDoc) {
  try {
    const subscribers = await NewsletterSubscriber.find({}).select("email").lean();
    console.log(subscribers, 'subscribers');
    
    if (!subscribers.length) {
      console.log("📭 No newsletter subscribers found.");
      return {
        success: true,
        sent: 0
      };
    }

    const articleUrl = `https://www.news.abanise.com/${newsDoc.slug}`;
    const imageUrl = getNewsImage(newsDoc.image);

    let sentCount = 0;
    let failedCount = 0;

    for (const subscriber of subscribers) {
      

      const emailRes = await bravo_sendEmail({
        to: subscriber.email,
        subject: `Abanise News Update: ${newsDoc.title}`,
        html: renderNewsBroadcastTemplate({
          newsTitle: newsDoc.title,
          summary: newsDoc.excerpt || "We just published a new school update for you.",
          imageUrl,
          articleUrl,
          category: Array.isArray(newsDoc.category)
            ? newsDoc.category.join(", ")
            : newsDoc.category || "School News"
        })
      });

      if (emailRes.success) {
        sentCount++;
      } else {
        failedCount++;
        console.error(`❌ Failed to send to ${subscriber.email}`, emailRes.error);
      }
    }

    console.log(`📨 News email sent. Success: ${sentCount}, Failed: ${failedCount}`);

    return {
      success: true,
      sent: sentCount,
      failed: failedCount
    };
  } catch (error) {
    console.error("❌ SEND NEWS TO SUBSCRIBERS ERROR:", error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/* =========================
   SAVE SINGLE WORDPRESS POST
========================= */
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

    /* =========================
       FIND EXISTING POST
    ========================= */
    let existingNews = null;

    if (wordpressId) {
      existingNews = await News.findOne({
        $or: [{ wordpressId }, { slug }]
      });
    } else {
      existingNews = await News.findOne({ slug });
    }

    /* =========================
       IMAGE DEDUPE LOGIC
    ========================= */
    let finalImage = "";
    let finalImagePublicId = "";

    if (sourceImageUrl) {
      const existingImageNews = await News.findOne({
        sourceImageUrl
      }).select("image imagePublicId sourceImageUrl");

      if (existingImageNews?.image) {
        finalImage = existingImageNews.image;
        finalImagePublicId = existingImageNews.imagePublicId || "";
        console.log(`♻ Reusing Cloudinary image for slug: ${slug}`);
      } else {
        const uploaded = await uploadImageUrlToCloudinary(sourceImageUrl, "news");
        finalImage = uploaded?.secure_url || "";
        finalImagePublicId = uploaded?.public_id || "";
        console.log(`☁ Uploaded image for slug: ${slug}`);
      }
    }

    /* =========================
       UPDATE EXISTING NEWS
       -> DO NOT SEND EMAIL
    ========================= */
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

      if (finalImage) existingNews.image = finalImage;
      if (finalImagePublicId) existingNews.imagePublicId = finalImagePublicId;
      if (wordpressId) existingNews.wordpressId = wordpressId;

      await existingNews.save();
          try {
      await sendNewsToSubscribers(news);
    } catch (emailError) {
      console.error(`❌ News saved but email sending failed for ${slug}:`, emailError.message);
    }
      console.log(`✏ Updated: ${slug}`);
      return {
        status: "updated",
        slug,
        newsId: existingNews._id
      };
    }

    /* =========================
       CREATE NEW NEWS
    ========================= */
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

    /* =========================
       SEND EMAIL TO SUBSCRIBERS
       ONLY FOR NEWLY CREATED POST
    ========================= */
    try {
      await sendNewsToSubscribers(news);
    } catch (emailError) {
      console.error(`❌ News saved but email sending failed for ${slug}:`, emailError.message);
    }

    return {
      status: "created",
      slug,
      newsId: news._id
    };
  } catch (error) {
    console.error(`❌ Error saving post ${post?.slug || post?.id}:`, error.message);
    return {
      status: "error",
      slug: post?.slug || "",
      error: error.message
    };
  }
}
async function saveSinglePosts(post) {
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
const oddscrapenews = async () => {
  try {
    let page = 0;
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

const scrapenews = async () => {
  try {

//     const start = new Date();
// const latest = await News.findOne().sort({ updatedAt: -1 });
//     console.log(latest);
    
// if (latest) {
//   await News.deleteOne({ _id: latest._id });
//   console.log("Deleted:", latest.title);
// }

    let page = 1;
    let keepGoing = true;

    let totalCreated = 0;
    let totalUpdated = 0;
    let totalSkipped = 0;
    let totalErrors = 0;

    // Stop after 6 consecutive unchanged posts
    let unchangedCount = 0;

    while (keepGoing) {
      const url = `https://schoolnewsng.com/wp-json/wp/v2/posts?per_page=100&page=${page}&_embed`;

      console.log(`\n📄 Fetching page ${page}...`);

      let response;

      try {
        response = await axios.get(url, {
          timeout: 30000,
          headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
              "Accept": "application/json,text/html,application/xhtml+xml",
              "Accept-Language": "en-US,en;q=0.9",
              "Referer": "https://schoolnewsng.com/",
              "Origin": "https://schoolnewsng.com"
            }
        });
      } catch (error) {
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
        const wordpressId = post.id;
        const title = he.decode(post?.title?.rendered || "").trim();

        // Check existing by WordPress ID
        const existingNews = await News.findOne({ wordpressId });
        // await sendNewsToSubscribers(existingNews)
        if (existingNews) {
          // Same ID + Same Title
          if ((existingNews.title || "").trim() === title) {
            unchangedCount++;

            console.log(
              `⏩ Unchanged (${unchangedCount}/6): ${title}`
            );

            if (unchangedCount >= 6) {
              console.log(
                "🛑 Found 6 consecutive unchanged posts. Stopping scraper."
              );

              keepGoing = false;
              break;
            }

            continue;
          }

          // Same ID but title changed
          unchangedCount = 0;

          const result = await saveSinglePost(post);

          if (result.status === "updated") {
            totalUpdated++;
          } else if (result.status === "error") {
            totalErrors++;
          }

          continue;
        }

        // New post
        unchangedCount = 0;

        const result = await saveSinglePost(post);

        if (result.status === "created") totalCreated++;
        else if (result.status === "updated") totalUpdated++;
        else if (result.status === "skipped_invalid") totalSkipped++;
        else if (result.status === "error") totalErrors++;
      }

      if (!keepGoing) {
        break;
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
    console.log(error.response?.status);
    console.log(error.response?.headers);
    console.log(error.response?.data);
    return {
      success: false,
      message: error.message
    };
  }
};

module.exports = { scrapenews };