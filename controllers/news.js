// const scrapenews = require('./scrapefunctin')
const News = require('../model/news')
// const scrapenews  = require("./scrapefunctin")
const {scrapenews} = require("./scrape")

const getAllNewss = async (req, res) => {
  try {
    const result = await scrapenews();

    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const escapeRegex = (text = "") => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const getAllNews = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 20);
    const skip = (page - 1) * limit;

    const filter = {};

    /* ================= CATEGORY FILTER ================= */
    if (req.query.category?.trim()) {
      let category = req.query.category.trim().toLowerCase();

      // frontend olevel => db o'level
      if (category === "olevel") {
        category = "o'level";
      }

      // because category is ARRAY of STRINGS
      filter.category = {
        $elemMatch: {
          $regex: `^${escapeRegex(category)}$`,
          $options: "i"
        }
      };
    }

    /* ================= SEARCH FILTER =================
       Search in title + excerpt + content
    ================================================ */
    if (req.query.search?.trim()) {
      filter.$text = {
        $search: req.query.search.trim()
      };
    }

  

    let query = News.find(filter)
      .select("title slug image excerpt datePublished category createdAt");

    // if searching, sort by relevance score first
    if (req.query.search?.trim()) {
      query = query
        .select({ score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" }, datePublished: -1, _id: -1 });
    } else {
      query = query.sort({ datePublished: -1, _id: -1 });
    }

    const [total, news] = await Promise.all([
      News.countDocuments(filter),
      query.skip(skip).limit(limit).lean()
    ]);
  
    return res.status(200).json({
      success: true,
      data: news,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error("GET ALL NEWS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch news"
    });
  }
};

const getSitemapNews = async (req, res) => {
  try {
    
    
    const news = await News.find({})
      .select("slug updatedAt datePublished")
      .sort({ datePublished: -1 })
      .lean();
    
    
    return res.status(200).json({
      success: true,
      data: news
    });

  } catch (error) {
    console.error("SITEMAP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};





const getNewsBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: 'Slug is required'
      });
    }

    const news = await News.findOne({ slug }).lean();

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: news
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



module.exports = {getAllNews,getSitemapNews, getNewsBySlug}