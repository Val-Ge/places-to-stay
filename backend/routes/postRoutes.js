import express from 'express';
import { validateBody } from '../validationMiddleware.js';
import upload from '../uploadConfigs.js';
import Post from '../models/post.js';
import Comment from '../models/comment.js';
import User from '../models/User.js';
const ObjectId = mongoose.Types.ObjectId;
import mongoose from 'mongoose';
import { ensureAuthenticated, ensureAdmin } from '../config/auth.js';
import { registerSchema, loginSchema, commentSchema, postSchema } from '../schemas.js';

const router = express.Router();
import methodOverride from 'method-override';


router.get('/new', ensureAuthenticated, ensureAdmin, (req, res) => {
    res.render('new');
});

router.post('/new', ensureAuthenticated, ensureAdmin, upload.single('image', validateBody(postSchema), async (req, res) => {
    try {
        const post = new Post({
            title: req.body.post.title,
            content: req.body.post.content,
            image: req.file.filename,
            location: req.body.post.location,
            comments:[]
        });
        await post.save();
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}));

router.get('/posts/:postId', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId).populate({
            path: 'comments',
            populate: {
                path: 'user',
                model: 'User'
            }
        }).populate({
            path: 'comments',
            populate:{
                path: 'childComments',
                populate: {
                    path: 'user'
                }
            }
        }).populate('comments.user');

        if (!post) {
            return res.status(404).send('Post not found');
        }

        const admin = req.isAuthenticated() && req.user.role === 'admin';
        res.render('post', { post, admin });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/posts/:postId/comments', ensureAuthenticated, validateBody(commentSchema), async(req, res) => {
    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).send('Post not found');
        }

        const newComment = new Comment({
            user: req.user._id,
            content: req.body.content,
            parentComment: req.body.parentComment || null
        });

        await newComment.save();

        if (newComment.parentComment) {
            const parentComment = await Comment.findById(newComment.parentComment);
            parentComment.childComments.push(newComment._id);
            await parentComment.save();
        } else {
            post.comments.push(newComment._id);
            await post.save();
        }

        res.redirect(`/posts/${req.params.postId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/posts/:postId/edit', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).send('Post not found');
        }
        res.render('edit', { post });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

router.put('/posts/:postId', ensureAuthenticated, ensureAdmin, upload.single('image'), validateBody(postSchema), async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).send('Post not found');
        }

            post.title = req.body.post.title;
            post.content = req.body.post.content;
            post.location = req.body.post.location;

            if (req.file) {
                post.image = req.file.filename;
            }

            await post.save();
            res.redirect('/');
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');

        }
});

export default router;