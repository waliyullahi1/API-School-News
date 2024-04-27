const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Jambnews = new Schema({
  title: {
    type: String,
    required: true
    },
    image:{
      type: String,
      required: true
      },
  content:{
    type: String,
    required: true
  },
  route: {
    type: String,
    required: true
  },



});

module.exports = mongoose.model('jambnews', Jambnews );