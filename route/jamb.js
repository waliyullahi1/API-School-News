const express = require("express");
const route = express.Router();
const  {admissionSp, newsDB, newsImage} = require("../controllers/jamb");

route.get("/", newsDB);
route.get("/:fileName", newsImage);
// route.get("/fileName", admissionDB);
module.exports = route;