import Joi from 'joi';

export const registerSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    password2: Joi.string().valid(Joi.ref('password')).required().strict(),
    role: Joi.string().default('user')
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

export const commentSchema = Joi.object({
    content: Joi.string().min(1).max(500).required(),
    parentComment: Joi.string().optional().allow(null), // Allow parentComment to be optional or null
});

export const postSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    content: Joi.string().min(3).required(),
    location: Joi.string().min(3).max(100).required(),
    // Placeholder for image, we'll handle the file validation manually
    image: Joi.any()
});

