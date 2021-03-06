const {Router} = require ('express');
const bcrypt = require('bcryptjs');
//const config = require('config');
const {check, validationResult} = require ('express-validator');
const jwt = require ('jsonwebtoken');
//const User = require('..models/users');
const User = require ('../models').users;

const router = Router()

// /api/auth/register
router.post(
    '/register', 
    [
        check('email', 'Invalid email').isEmail(),
        check('password', 'Minimal size of password 6 characters').isLength({min:6})
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message:'Invalid data in auth'
            })
        }

        const {nickName, email, password} = req.body
        const candidate = await User.findOne({
            where: { 
                email: req.body.email
                
            }
            
        })
        
        if (candidate) {
           return res.status(400).json({message:'A user with this e-mail address already exists'})
        }
        
        const hashedPassword = await bcrypt.hash(password, 12);
        console.log('any',req.body)
        await User.create ({nickName, email, password:hashedPassword})
        res.status(201).json({message:'User created'})
       

        
    } catch (error) { 
        
        res.status(500).json ({message: 'Something went wrong. Please try again pal'})
    }
})


router.post(
    '/login', 
    [
        check('email', 'Enter correct email').normalizeEmail().isEmail(),
        check('password','Enter password').exists()
        
    ],
    async (req, res) =>{
        try {
            const errors = validationResult(req);
    
            if (!errors.isEmpty()){
                return res.status(400).json({
                    errors: errors.array(),
                    message:'Invalid data in auth'
                })
            }

        const {email, password} = req.body

        const user = await User.findOne({ 
            where: { 
            email: req.body.email
            
        }
    })

        if (!user) {
            return res.status(400).json ({message: 'User not found'})
        }
        
        console.log('user',user.toJSON());
        console.log('bodee',req.body)
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json ({message:'wrong password'})
        }
        
        console.log('check')
        const token = jwt.sign(
            {userId: user.userId},
            config.get('jwtSecret'),
            {expiresIn: '1h'}

        )
        
        res.json({token, userId: user.userId})
        console.log('check')
        } catch (error) {
            res.status(500).json ({message: 'Something went wrong. Please try again'})
        }
})
module.exports = router