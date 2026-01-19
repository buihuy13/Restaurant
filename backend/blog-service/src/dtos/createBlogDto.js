import Joi from 'joi';

export const createBlogSchema = Joi.object({
    title: Joi.string().max(200).required(),
    content: Joi.string().required(),
    excerpt: Joi.string().optional(),
    author: Joi.object({
        userId: Joi.string().required(),
        name: Joi.string().required(),
        avatar: Joi.string().uri().optional(),
    }).required(),
    // featuredImage and images are handled as file uploads, not in JSON body
    category: Joi.string().valid('recipe', 'review', 'tips', 'news', 'health', 'other').default('other'),
    tags: Joi.array().items(Joi.string()).optional(),
    status: Joi.string().valid('draft', 'published').default('draft'),
    seo: Joi.object({
        metaTitle: Joi.string().optional(),
        metaDescription: Joi.string().optional(),
        keywords: Joi.array().items(Joi.string()).optional(),
    }).optional(),
});

