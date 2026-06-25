
const express = require("express");
const route = express.Router();
const  { subscribeNewsletter } = require("../controllers/newsletter");
const {scrapenews } = require("../controllers/scrape");
const {renderNewsBroadcastTemplate} = require("../template/subscribed");




route.post("/subscribe", subscribeNewsletter);





// route.get("/scrape", scrapenews);

// route.get("/:route", singlenewsDB);
module.exports = route;