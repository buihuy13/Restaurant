import Joi from 'joi';

export const updateBlogSchema = Joi.object({
    title: Joi.string().max(200).optional(),
    content: Joi.string().optional(),
    excerpt: Joi.string().max(500).optional(),
    featuredImage: Joi.object({
        url: Joi.string().uri().required(),
        alt: Joi.string().optional(),
    }).optional(),
    category: Joi.string().valid('recipe', 'review', 'tips', 'news', 'health', 'other').optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    status: Joi.string().valid('draft', 'published', 'archived').optional(),
    seo: Joi.object({
        metaTitle: Joi.string().optional(),
        metaDescription: Joi.string().optional(),
        keywords: Joi.array().items(Joi.string()).optional(),
    }).optional(),
});
