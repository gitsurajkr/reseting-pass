const express = require('express');
const router = express.Router();
const zod = require('zod');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/Jwtkey');
const User = require('../config/db');
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser');
router.use(cookieParser());
// Validate schema using Zod
const signupBody = zod.object({
    firstname: zod.string(),
    lastname: zod.string(),
    username: zod.string(),
    password: zod.string().min(6),
    email: zod.string().email(),
    
});

router.post('/signup', async (req, res) => {
    const { success, error } = signupBody.safeParse(req.body);

    if (!success) {
        return res.status(400).json({ message: 'Invalid request body', errors: error.errors });
    }

    try {
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create new user
        const user = await User.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
            
        });

        console.log(user);

        const userId = user._id;

        const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1d' });

        return res.status(201).json({
            message: 'User created successfully',
            token
        });
        
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

const signInBodySchema = zod.object({
    username: zod.string(),  
    password: zod.string()
});

router.post('/signin', async (req, res) => {
    const validationResult = signInBodySchema.safeParse(req.body);
    if (!validationResult.success) {
        return res.status(400).json({ message: 'Invalid request body', errors: validationResult.error.errors });
    }

    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Incorrect Password' });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });

        return res.status(200).json({
            message: 'User signed in successfully',
            token
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Password reset request route
router.post('/password-reset/request', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email' });
        }

        const resetToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        await User.findOneAndUpdate(
            { _id: user._id },
            { resetToken, resetTokenExpires: Date.now() + 3600000 }, // 1 hour
            { new: true }
        );

        // Setup Nodemailer transport
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        console.log("call reach here")

        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Password Reset Request',
            html: `
                <h1>Password Reset Request</h1>
                <p>Click <a href="http://127.0.0.1:5173/reset-password/${resetToken}">here</a> to reset your password</p>
                <p>${resetToken}</p>
                <p>If you did not request this, please ignore this email.</p>
            `
            // <p>Your reset token is: <strong>${resetToken}</strong></p>
        };

        // const testMailOptions = {
        //     from: process.env.EMAIL,
        //     to: "stormnova04@gmail.com",
        //     subject: 'Password Reset Request',
        //     text: "This is a test email from nodemailer"
        // }

        // await transporter.sendMail(testMailOptions);
        // console.log("Email sent successfully!");

        // res.status(200).json({ message: 'Password reset link sent successfully' });

        try{
            await transporter.sendMail(mailOptions);
            console.log("Email sent successfully!",user.email);
            res.status(200).json({ message: 'Password reset link sent successfully' });
        } catch (err) {
            console.error('Error sending email:', err);
            return res.status(500).json({ message: 'Failed to send mail' });
        }
            


    } catch (err) {
        console.error('Error sending email:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Password reset verification route
router.post('/password-reset/verify ', async (req, res) => {
    const { resetToken } = req.cookies.token;

    try {
        if (!resetToken) {
            return res.status(400).json({ message: 'No reset token found in cookies' });
        }
        const decoded = jwt.verify(resetToken, JWT_SECRET);
        const userId = decoded.userId;

        const user = await User.findOne({ _id: userId });
        if (!user || user.resetTokenExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        res.status(200).json({ message: 'Token is valid' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Password update route
router.post('/password-reset/update', async (req, res) => {
    const {  newPassword } = req.body;
    const token = req.cookies.token;

    if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    try {
        if (!token) {
            return res.status(400).json({ message: 'No reset token found in cookies' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;

        const user = await User.findOne({ _id: userId });
        if (!user || user.resetTokenExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpires = null;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
