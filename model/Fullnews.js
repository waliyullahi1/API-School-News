const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new mongoose.Schema({
  name: String,
  img: { data: Buffer, contentType: String }
});

// Create a model from the schema

module.exports = mongoose.model('Image', ImageSchema);