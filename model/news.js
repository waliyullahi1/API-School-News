const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NewsSchema = new Schema(
  {
    wordpressId: {
      type: Number,
      unique: true,
      sparse: true,
      index: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },

    // since category is array of strings
    category: {
      type: [String],
      default: [],
      index: true
    },

    image: {
      type: String,
      default: ""
    },

    imagePublicId: {
      type: String,
      default: ""
    },

    sourceImageUrl: {
      type: String,
      default: "",
      index: true
    },

    sourceUrl: {
      type: String,
      default: ""
    },

    content: {
      type: String,
      required: true
    },

    excerpt: {
      type: String,
      required: true
    },

    datePublished: {
      type: Date,
      index: true
    }
  },
  { timestamps: true }
);

// helpful indexes
NewsSchema.index({ createdAt: -1 });
NewsSchema.index({ datePublished: -1 });
NewsSchema.index({ category: 1, datePublished: -1 });

// FULL TEXT SEARCH INDEX
NewsSchema.index({
  title: "text",
  excerpt: "text",
  content: "text"
});

module.exports = mongoose.model("News", NewsSchema);