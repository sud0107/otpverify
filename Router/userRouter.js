const express = require("express");
const mongoose = require("mongoose");
const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const router = express.Router();
require("dotenv").config();


var transpoter = nodemailer.createTransport({
    service: "gmail",
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        type: "login",
        user: process.env.EMAIL,
        pass: process.env.PASS
    },
    tls: {
        rejectUnauthorized: false
    }
})

router.post("/signup", async (req, res) => {
    const{ name, email, password } = req.body;
    const user = new User({
        name, 
        email,
        password,
        emailToken: crypto.randomBytes(64).toString('hex'),
        isVerified: false,
    })
    const salt = await bcrypt.genSaltSync(10);
    const hashPassword =  await bcrypt.hashSync(user.password, salt);
    user.password = hashPassword;
    const newuser = user.save().then(() => {
       console.log("New user has been saved !!")
    }). catch(err => {
       console.log("Error during saving the data !!")
    })
    

    var mailOption = {
        from: `"Verify your email" <jhaamrit08@gmail.com>`,
        to: "jhasudhanshu08@gmail.com",
        subject: "Verify your email right now !!",
        html: "<b>Your email has been verified !! third time</b>"
    }

    transpoter.sendMail(mailOption, (err, result) => {
        if(err) {
            console.log(err);
            res.status(404).json({
                message: "Something went wrong while sending verification email !!"
            })
        } else {
            res.status(202).json({
                message: "verification email hass been sent !! Please check your email !!"
            })
        }
    })

    
})

router.post("/login", async(req, res) => {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email })
    if(findUser) {
        // const match = await bcrypt.compare(password, findUser.password);
        if(password === findUser.password) {
            res.status(202).json({
                message: "Password matched successfully !!"
            })
        } else {
            // console.log(password);
            // console.log(findUser.password);
            res.status(404).json({
                message: "Error during password comparision !!"
            })
        }
    } else {
        res.status(404).json({
            message: "User not registered !!"
        })
    }
})







module.exports = router;
