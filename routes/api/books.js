const express = require("express");
const Book = require("../../models/Book");
const router = express.Router();

const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderName = req.body.title;
    const folderPath = `public/${folderName}_${Date.now()}`;

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename (you can keep the current implementation if needed)
    cb(null, req.body.title + "." + file.originalname.split(".").pop());
  },
});

const upload = multer({ storage });

const isAdmin = require("../../middlewares/isAdmin");

router.post(
  "/api/books",
  isAdmin,
  upload.fields([
    { name: "imageFile", maxCount: 1 },
    { name: "pdfFile", maxCount: 1 },
  ]),
  async function (req, res) {
    try {
      // console.log(req.files);
      let book = req.body;

      const coverPhotoInfo = req.files.imageFile[0];
      const pdfInfo = req.files.pdfFile[0];

      book.coverPhotoUri = `${coverPhotoInfo.destination.split("/")[1]}/${coverPhotoInfo.filename}`;
      book.pdfUri = `${pdfInfo.destination.split("/")[1]}/${pdfInfo.filename}`;

      console.log(book);

      let record = new Book(book);
      await record.save();
      res.send(record);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "An Error has occured" });
    }
  }
);

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
