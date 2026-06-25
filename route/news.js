const express = require("express");
const route = express.Router();
const  { getNewsBySlug, getAllNews } = require("../controllers/news");

route.get("/", getAllNews);
route.get("/:slug", getNewsBySlug);

// route.get("/:route", singlenewsDB);
module.exports = route;