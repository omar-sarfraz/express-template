const express = require("express");
const Book = require("../../models/Book");
let router = express.Router();

router.post("/api/books", async function (req, res) {
  let record = new Book(req.body);
  await record.save();
  res.send(record);
});

router.put("/api/books/:id", async function (req, res) {
  //   return res.send(req.body);
  let record = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.send(record);
});

router.delete("/api/books/:id", async function (req, res) {
  let record = await Book.findByIdAndDelete(req.params.id);
  res.send("Done");
});

router.get("/api/books/:id", async function (req, res) {
  let record = await Book.findById(req.params.id);
  res.send(record);
});

router.get("/api/books", async function (req, res) {
  let records = await Book.find();
  res.send(records);
});

module.exports = router;
