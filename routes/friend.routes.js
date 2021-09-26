const { Router } = require("express");
const config = require("config");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models").users;
const auth = require("../middleware/auth.middleware");

const router = Router();

router.post("/add", auth, async (req, res) => {
  try {
    console.log(req.body);
    const currentUser = await User.findOne({
      where: {
        uuid: req.body.userId,
      },
    });
    const candidate = await User.findOne({
      where: {
        nickName: req.body.friendName,
        email: req.body.friendEmail,
      },
    });
    if (!candidate) {
      return res.status(400).json({ message: "User not exists" });
    }
    const toAddFriend = candidate;
    if (currentUser === toAddFriend) {
      return res.status(400).json({ message: "You are adding yourself!" });
    }
    currentUser.addUser(toAddFriend);
    res.status(201).json({ message: "Firiend added!" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong. Please try again" });
  }
});

router.post("/list", auth, async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        uuid: req.body.userId,
      },
    });
    const friendsList = await user.getUser({
      raw: true,
      attributes: ["nickname", "email"],
      through:{
          attributes:[]
      }
    });
    
    res.status(201).json({friendsList});
  } catch (e) {
    res.status(500).json({ message: "Something went wrong. Please try again" });
  }
});
module.exports = router;
