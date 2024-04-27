const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Postutme = new Schema({
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

module.exports = mongoose.model('postutmes', Postutme);