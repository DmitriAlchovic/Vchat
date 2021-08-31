const { Router } = require("express");
const config = require("config");
//const shortid = require('shortid')
const auth = require("../middleware/auth.middleware");
const router = Router();
const User = require("../models").users;
const Character = require("../models").characters;
router.post("/create", auth, async (req, res) => {
  try {
    const {charName, charDiscription, rpSystem } = req.body;

    console.log(
     
      "Name",
      charName,
      "Discr",
      charDiscription,
      "sys",
      rpSystem
    );
    const user = await User.findAll({
      where: {
        uuid: req.body.userId,
      },
      raw:true,
      attributes:['userId']
    }); 
    console.log (user[0].userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    console.log(rpSystem);
    await Character.create({
      charName: charName,
      discription: charDiscription,
      rpSystem: rpSystem,
      uuid:user[0].userId
    });

    res.status(201).json({ message: "Character created!" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong. Please try again" });
  }
});

router.post('/list', auth, async (req, res) => {
  try {

    console.log(req.body.userId);
     const user = await User.findAll({
      where: {
        uuid: req.body.userId,
      },
      raw:true,
      attributes:['userId']
    });
      console.log(user[0].userId);
    const charList = await Character.findAll({
      where: {
        uuid: user[0].userId,
      },
      raw:true,
      attributes:['charName', 'rpSystem', 'discription']
    });
    console.log(charList);
    res.status(201).json({charList})

  } catch (e) {
    res.status(500).json({ message: 'Something went wrong. Please try again' })
  }
})


module.exports = router;
