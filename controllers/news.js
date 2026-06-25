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




const getAllNews = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const filter = {};

    // ================= CATEGORY FILTER =================
if (req.query.category) {
  if(req.query.category === 'olevel'){
    req.query.category = "o'level";
  }
  filter.category = {
    $regex: `^${req.query.category.trim()}$`,
    $options: 'i'
  };
}
    console.log( req.query.category, ' req.query.category');

console.log( filter.category, ' filter.category');

    // ================= TITLE SEARCH FILTER =================
    if (req.query.title) {
      filter.title = {
        $regex: req.query.title.trim(),
        $options: 'i' // case-insensitive
      };
    }
    
    const [total, news] = await Promise.all([
      News.countDocuments(filter),
      News.find(filter)
        .select('title slug image excerpt datePublished category createdAt')
       
         .sort({ datePublished: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
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



module.exports = {getAllNews, getNewsBySlug}