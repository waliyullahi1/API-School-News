
const express = require("express");
const route = express.Router();
const  { subscribeNewsletter } = require("../controllers/newsletter");

route.post("/subscribe", subscribeNewsletter);


// route.get("/:route", singlenewsDB);
module.exports = route;