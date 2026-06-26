const express = require("express");
const route = express.Router();
const  { getNewsBySlug, getSitemapNews, getAllNews } = require("../controllers/news");
const {scrapenews } = require("../controllers/scrape");
route.get("/", getAllNews);
route.get("/sitemap", getSitemapNews);
route.get("/site", scrapenews)
route.get("/:slug", getNewsBySlug);

// route.get("/:route", singlenewsDB);
module.exports = route;