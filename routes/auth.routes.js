const { Router } = require("express");
const bcrypt = require("bcryptjs");
const config = require("config");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models").users;
const fs = require("fs");

const router = Router();

// /api/auth/register
router.post(
  "/register",
  [
    check("email", "Invalid email").isEmail(),
    check("password", "Minimal size of password 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Invalid data in auth",
        });
      }

      const { nickname: nickname, email, password } = req.body;
      const candidate = await User.findOne({
        where: {
          email: req.body.email,
        },
      });

      if (candidate) {
        return res
          .status(400)
          .json({ message: "A user with this e-mail address already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = await User.create({
        nickname: nickname,
        email,
        password: hashedPassword,
      });
      fs.mkdirSync(`${config.get("filePath")}/${newUser.uuid}`);
      fs.mkdirSync(`${config.get("filePath")}/${userUuid}/characters`);
      res.status(201).json({ message: "User created" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Something went wrong. Please try again" });
    }
  }
);

router.post(
  "/login",
  [
    check("email", "Enter correct email").normalizeEmail().isEmail(),
    check("password", "Enter password").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Invalid data in auth",
        });
      }

      const { email, password } = req.body;

      const user = await User.findOne({
        where: {
          email: req.body.email,
        },
      });

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "wrong password" });
      }
      const token = jwt.sign({ userId: user.uuid }, config.get("jwtSecret"), {
        expiresIn: "24h",
      });

      res.json({ token, userId: user.uuid });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Something went wrong. Please try again" });
    }
  }
);

router.post("/info", async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        uuid: req.body.userId,
      },
      raw: true,
      attributes: ["nickname", "email"],
    });

    res.status(201).json({ user });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong. Please try again" });
  }
});
module.exports = router;
