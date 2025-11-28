const express = require('express');
const User = require('../models/User');
const router = express.Router();
const nodemailer = require("nodemailer");

router.get('/addUser', async (req, res) => {
    try {
        const name = "Aliabbas";
        const vehicle_ID = "GJ06NS1859";
        const phone_No = "2902382032";
        const state = "Gujarat";
        const city = "Vadodara";
        const postal_area = "Ajwa";
        const mail = "aliabbasbhaisaheb@gmail.com";


        const newUser = new User({ name, vehicle_ID, phone_No, registered_Address: { state, city, postal_area }, mail });
        await newUser.save();
        return res.status(201).json({ message: 'Company added successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
});

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

router.post("/getOTP", async (req, res) => {
    try {
        const { vehicle_ID } = req.body;

        const user = await User.findOne({ vehicle_ID });

        if (!user) return res.status(404).json({ error: "User not found" });

        if(user.pass!=="0000"){
            res.status(500).json({ error: "You have already set password, try logIn" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min
        await user.save();

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.mail,
            subject: "Your OTP Code",
            text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
        });

        res.json({ message: "OTP sent to email" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.post('/verifyOTP', async (req, res) => {
    const { vehicle_ID, otp } = req.body;
    const user = await User.findOne({ vehicle_ID });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });
    if (user.otpExpiry < new Date()) return res.status(400).json({ error: "OTP expired" });

    res.status(200).json({ message: "OTP verified successfully" });
})

router.post('/setPassword', async (req, res) => {
    const { vehicle_ID,password } = req.body;
    console.log(req.body);
    const user = await User.findOne({ vehicle_ID });
    if (!user) return res.status(404).json({ error: "User not found" });

    user.pass=password;
    await user.save();

    res.json({ message: "Password updated successfully" ,user});
});

router.post("/logIn", async (req, res) => {
    try {
        const { vehicle_ID,pass } = req.body;

        const user = await User.findOne({ vehicle_ID });

        if (!user) return res.status(404).json({ error: "User not found" });

        if(user.pass==="0000"){
            res.status(500).json({ error: "You haven't set password, try signUp" });
        }

        if (user.pass !== pass) return res.status(400).json({ error: "Invalid Password" });

        res.json({ message: "LogIn sucess!",user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});


module.exports = router;