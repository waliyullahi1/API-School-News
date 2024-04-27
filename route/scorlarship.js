const express = require("express");
const route = express.Router();
const  { newsDB, newsImage} = require("../controllers/scorlarship");

route.get("/", newsDB);
route.get("/:fileName", newsImage);
// route.get("/fileName", admissionDB);
module.exports = route;