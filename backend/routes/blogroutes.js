import express from 'express';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import Message from '../models/message.js';
import Post from '../models/post.js';
import { ensureAuthenticated, ensureAdmin } from '../config/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const posts = await Post.find();
    res.render('index', { posts });
});

router.get('/about', (req, res) => {
    res.render('about')
});

router.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    const newMessage = new Message({ name, email, message });

    try {
        await newMessage.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECIPIENT_EMAIL,
            subject: 'New Contact Form Submission',
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if(error) {
                console.error(error);
                res.status(500).send('Error: Failed to send email');
            } else {
                console.log('Email sent: ' + info.response);
                res.redirect('/');
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error: Failed to save message.');
    }
});

export default router;