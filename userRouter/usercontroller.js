const express = require("express");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
// const axois = require("axois");
const otpGenerator =  require("otp-generator");
const router = express.Router();

const { User } = require("../model/user");
const { Otp } = require("../model/otp");


router.post("/signup", async (req, res) => {
    const user = await User.findOne({
        email: req.body.email
    })
    if(user) {
        res.status(404).json({ 
            message: "User already exist !!"
        })
    } else {
        const OTP = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        })
    
        const email = req.body.email;
        console.log("Your otp is ", OTP);
    
        const otp = new Otp({
            email: email,
            otp: OTP
        })
        // const salt = await bcrypt.genSalt(10);
        // otp.otp = await bcrypt.hash(otp.otp, salt)
        const result = await otp.save();
        return res.status(202).json({
            message: "Otp send Successfully !!"
        })
    }

    
})

router.post("/verifyotp", async (req, res) => {
    const otpHolder = await Otp.find({
        email: req.body.email
    });
    if(otpHolder.length === 0) {
        res.status(404).json({
            message: "You are using an expire OTP !!"
        })
    } else {
        const rightOTPFind = otpHolder[otpHolder.length - 1];
        if(req.body.otp == rightOTPFind.otp && rightOTPFind.email == req.body.email) {
            const user = new User(_.pick(req.body, ["email"]));
            const token = user.generateJWT();
            const result = await user.save();
            const otpDelete = await Otp.deleteMany({
                email: rightOTPFind.email
            });
            res.status(202).json({
                message: "User Registraation Successfully !!",
                token: token,
                data: result
            });
        } else {
            res.status(404).json({
                message:"Your OTP was wrong !!"
            })
        }
    }
})


module.exports = router;

