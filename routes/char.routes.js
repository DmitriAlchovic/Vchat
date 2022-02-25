const { Router } = require("express");
const config = require("config");
//const shortid = require('shortid')
const auth = require("../middleware/auth.middleware");
const router = Router();
const User = require("../models").users;
const Character = require("../models").characters;
const fs = require('fs');

router.post("/create", auth, async (req, res) => {
  try {
    const {charName, charDiscription, rpSystem } = JSON.parse(req.body.newChar);
    const userUuid = req.body.userId;
    const user = await User.findAll({
      where: {
        uuid: userUuid,
      },
      raw:true,
      attributes:['userId']
    }); 
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
     const newChar = await Character.create({
      charName: charName,
      discription: charDiscription,
      rpSystem: rpSystem,
      uuid:user[0].userId
    }); 
    const path = `${config.get('filePath')}/${userUuid}/characters/${newChar.charId}`;
    fs.mkdirSync(`${path}`);
    const files = req.files;
    if (files) {
      const avatar = files.avatar;
      const charSheet = files.charSheet;
      if (charSheet){
        if( charSheet.name.split('.').pop() === 'pdf'){
          charSheet.mv(`${path}/sheet.pdf`)
        }
        else {
          return res.status(400).json({ message: "Sorry! Character sheet file must be pdf type!" });
        }
      }
      if (avatar) {
        const type = avatar.name.split('.').pop();
        if( type === 'jpg' || type === 'png'){
          avatar.mv(`${path}/avatar.${type}`);
        }
        else {
          return res.status(400).json({ message: "Sorry! Character avatar must be jpg of png type!" });
        }
      }
    }

    res.status(201).json({ message: "Character created!" });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong. Please try again" });
  }
});

router.post('/list', auth, async (req, res) => {
  try {

     const user = await User.findAll({
      where: {
        uuid: req.body.userId,
      },
      raw:true,
      attributes:['userId']
    });
    const charList = await Character.findAll({
      where: {
        uuid: user[0].userId,
      },
      raw:true,
      attributes:['charId','charName', 'rpSystem', 'discription']
    });
    res.status(201).json({charList})

  } catch (e) {
    res.status(500).json({ message: 'Something went wrong. Please try again' })
  }
})

router.post('/view', auth, async (req, res) => {
  try {
    const userUuid = req.body.userId;
     const user = await User.findAll({
      where: {
        uuid: userUuid,
      },
      raw:true,
      attributes:['userId']
    });
    const char = await Character.findOne({
      where: {
        uuid: user[0].userId,
      },
      raw:true,
      attributes:['charId']
    });
    const path = `${config.get('filePath')}/${userUuid}/${char.charId}/sheet.pdf`
      if (fs.existsSync(path)){
        return res.download(path)
      }
    res.status(400).json({message:'No character sheet'})

  } catch (e) {
    res.status(500).json({ message: 'Something went wrong. Please try again' })
  }
})

module.exports = router;
