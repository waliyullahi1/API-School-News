const express = require("express");
const route = express.Router();
const  {admissionSp, admissionDB, admissionImage} = require("../controllers/admissionSp");

route.get("/", admissionDB);
route.get("/:fileName", admissionImage);
// route.get("/fileName", admissionDB);
module.exports = route;