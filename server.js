require("dotenv").config();
const express = require("express");
const app = express();
const punycode = require('punycode/')
const PORT = process.env.PORT || 3500;
const path = require("path");
const { logger } = require("./middleware/logEvent");
const cors = require("cors");
const errorHandle = require("./middleware/erroHandle");
// const corsOptions = require("./config/corsOptions");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const credentials = require("./middleware/credentials");


//connect to mongoose
connectDB();

app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
//  app.use(credentials);

//Cross Origin Resource sharing

const corsOptions = {

  origin: ['https://news.abaniseedu.com','https://www.abaniseedu.com', 'http://localhost:3000'],
  credentials: true,
  // optionsSuccessStatus:40

};
app.use(cors(corsOptions));


//Build-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

//buld-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

// serve static  public
app.use("/", express.static(path.join(__dirname, "/public")));

//routes


app.use("/scrape", require("./route/scrape"));
app.use("/admissionNews", require("./route/admission"));
app.use("/jambNews", require("./route/jamb"));
app.use("/olevelNews", require("./route/olevel"));
app.use("/news", require("./route/news"));
app.use("/postutme", require("./route/postutme"));
app.use("/scholarshipNews", require("./route/scorlarship"));
const os = require("os");
const networkInterfaces = os.networkInterfaces();
let addresses = [];

for (const k in networkInterfaces) {
  for (const k2 in networkInterfaces[k]) {
    const address = networkInterfaces[k][k2];
    if (address.family === "IPv4" && !address.internal) {
      addresses.push(address.address);
    }
  }
}

console.log(addresses);




// app.use(verifyJWT);


app.get(
  "/red(.html)?",
  (req, res, next) => {
    console.log("Allah help me");
    next();
  },
  (req, res) => {
    res.send("it is okay");
  }
);
//handle error
app.use(errorHandle);

mongoose.connection.once("open", () => {
  console.log("connected to mangoosedb");

  app.listen(PORT, () => console.log(`serves run on Port ${PORT}`));
});
