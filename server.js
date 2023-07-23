const express = require("express");
let app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use("/", require("./routes/api/userAuth"));

app.use(require("./middlewares/auth"));
app.use("/", require("./routes/api/books"));

app.use((req, res, next) => {
  res.status(404).send("Not Found");
});

const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 5000;

const mongoose = require("mongoose");
mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true })
  .then(() => console.log("Connected to Mongo ...."))
  .catch((error) => console.log(error.message));

app.listen(PORT, () => {
  console.log("Server Started on port", PORT);
});
