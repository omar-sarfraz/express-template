const mongoose = require("mongoose");

let modelSchema = mongoose.Schema({
  title: String,
  description: String,
  isPublished: Boolean,
  author: String,
  cover_photo: String,
  url: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
});

let Model = mongoose.model("Book", modelSchema);
module.exports = Model;
