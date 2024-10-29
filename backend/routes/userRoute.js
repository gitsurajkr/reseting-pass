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
// Send Password Reset Link
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

        // Include user ID in reset link
        const resetLink = `http://localhost:5173/reset-password/${user._id}`;

        // Nodemailer setup for sending the email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Password Reset Request',
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset link sent successfully' });
    } catch (err) {
        console.error('Error sending email:', err);
        res.status(500).json({ message: 'Failed to send email' });
    }
});

// Update Password (Directly)
router.post('/password-reset/update/:userId', async (req, res) => {
    const { userId } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Hash new password and update user record
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Error updating password:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;

