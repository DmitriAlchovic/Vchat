const { Router } = require("express");
const config = require("config");
const Room = require("../models").rooms;
const auth = require("../middleware/auth.middleware");
const router = Router();

router.post("/generate", auth, async (req, res) => {
  try {
    const { roomName } = req.body;

    const candidate = await Room.findOne({
      where: {
        roomName: req.body.roomName,
      },
    });

    if (candidate) {
      return res
        .status(400)
        .json({ message: "A room with this name address already exists" });
    }
    const room = await Room.create({ roomName });

    res.status(201).json({ room });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong. Please try again" });
  }
});

router.get("/list", auth, async (req, res) => {
  try {
    const roomsList = await Room.findAll({
      raw: true,
      attributes: ["roomName", "roomUuid"],
    });

    /*  const links = await Link.find({ owner: req.user.userId }) */
    res.status(201).json({ roomsList });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong. Please try again" });
  }
});

router.post("/join", auth, async (req, res) => {
  try {
    const { roomName } = req.body;
    const candidate = await Room.findOne({
      where: {
        roomName: roomName,
      },
      raw: true,
      attributes: ["roomUuid"],
    });
    if (!candidate) {
      return res
        .status(400)
        .json({ message: "A room with that name was closed" });
    }
    const roomUuid = candidate;
    res.status(201).json({ roomUuid });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong. Please try again" });
  }
});

module.exports = router;
