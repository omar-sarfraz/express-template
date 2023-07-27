const mongoose = require("mongoose");

let modelSchema = mongoose.Schema({
  title: String,
  description: String,
  isPublished: Boolean,
  author: String,
  coverPhotoUri: String,
  pdfUri: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
});

let Model = mongoose.model("Book", modelSchema);
module.exports = Model;
