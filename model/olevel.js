const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Olevel = new Schema({
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

module.exports = mongoose.model('olevel', Olevel );