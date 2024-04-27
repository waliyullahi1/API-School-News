const express = require("express");
const route = express.Router();
const  {singlenewsDB, newsDB, newsImage} = require("../controllers/news");

route.get("/", newsDB);
route.get("/name/:route", singlenewsDB);
route.get("/:fileName", newsImage);
// route.get("/:route", singlenewsDB);
module.exports = route;