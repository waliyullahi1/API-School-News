const mongoose = require('mongoose');
const News = require('../model/news'); // adjust path to your News model

const connectdb = async () => {
  try {
    await mongoose.connect(process.env.DATA_BASE);

    console.log("MongoDB connected successfully");

    // create/update indexes for News model
    await News.syncIndexes();
    console.log("News indexes synced successfully");

  } catch (err) {
    console.error("MongoDB connection/index error:", err);
    process.exit(1);
  }
};

module.exports = connectdb;