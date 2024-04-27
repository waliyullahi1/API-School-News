const express = require("express");
const route = express.Router();
const scrapenews = require("../controllers/join");

route.get("/", scrapenews);

module.exports = route;