const express = require("express");
const route = express.Router();
const saveImage = require("../middleware/imageupload");

route.post("/",upload.single('image'), saveImage);

module.exports = route;
