const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const User = require("../../models/User");

dotenv.config();

const router = express.Router();

router.post("/api/signup", async (req, res) => {
  try {
    const { password } = req.body;
    let receivedUser = req.body;

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(403).json({ message: "User already Exists" });
    if (receivedUser.password !== receivedUser.confirmPassword) return res.status(403).json({ message: "Password do not match" });

    receivedUser.password = await bcrypt.hash(password, process.env.HASH_SECRET_KEY);

    user = await User.create(receivedUser);
    const token = jwt.sign({ email: user.email, id: user._id }, process.env.SECRET_KEY, { expiresIn: "24h" });
    res.status(200).json({ user, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
});

router.post("/api/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) return res.status(403).json({ message: "User does not exist" });

    let isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(403).json({ message: "Invalid Credentials" });

    const token = jwt.sign({ email: user.email, id: user._id }, process.env.SECRET_KEY, { expiresIn: "3h" });
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
});

module.exports = router;