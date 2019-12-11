const express = require('express');
const app =  express();
const router = express.Router();
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const keys = require('../../config/keys');

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

const User = require('../../models/User');

app.use(
    bodyParser.urlencoded({
        extended: false
}));

app.use(bodyParser.json());
router.post("/register",(req,res)=>{
    const {err,isValid} = validateRegisterInput(req.body);
    if(!isValid){
        res.status(400).json(err);
    }

    
    User.findOne({email: req.body.email}).then(user => {
        if(user){
            return res.status(400).json({email: "Email already exists"});
        }else{
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err,salt) => {
                bcrypt.hash(newUser.password, salt, (err,hash)=>{
                    if(err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => {res.json(err)});
                });
            });
        }
    });

});


router.post("/login", (req,res)=>{
    const {err, isValid} = validateLoginInput(req.body);
        if(!isValid){
            return res.status(400).json(err);
        }

        const email = req.body.email;
        const password = req.body.password;

        User.findOne({email}).then(user =>{
            if(!user){
                return res.status(400).json({Email: "Email not Found"});
            }

            bcrypt.compare(password,user.password).then(isMatch=>{
                if(isMatch){
                    const payload = {
                        id: user.id,
                        name: user.name
                    };
                
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926
                    },
                    (err,token) =>{
                        res.json({
                            success: true,
                            token: "Bearer " + token
                        });
                    }
                );
                }else{
                    return res
                        .status(400)
                        .json({passeordincorrect: "Password Incorrect"});
                }
            });
        });
});

module.exports = router;