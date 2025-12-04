// src/config/openapi.js
export const blogServiceOpenAPI = {
    openapi: '3.0.3',
    info: {
        title: 'FoodEats Blog Service API',
        version: '1.0.0',
        description: 'Quản lý Blog, Comment (nested), Upload ảnh – Full JWT + Cloudinary + MongoDB',
        contact: { name: 'CNTTK18 Team' },
    },
    servers: [
        { url: 'http://localhost:8080/api/blogs', description: 'Local via Gateway' },
        { url: 'https://api.foodeats.vn/api/blogs', description: 'Production' },
    ],
    tags: [
        { name: 'Blogs', description: 'Quản lý bài viết blog' },
        { name: 'Comments', description: 'Bình luận & trả lời theo cây' },
        { name: 'Upload', description: 'Upload & xóa ảnh Cloudinary' },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        schemas: {
            Blog: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    title: { type: 'string' },
                    slug: { type: 'string' },
                    excerpt: { type: 'string' },
                    content: { type: 'string' },
                    featuredImage: {
                        type: 'object',
                        properties: { url: { type: 'string', format: 'uri' }, alt: { type: 'string' } },
                    },
                    author: {
                        type: 'object',
                        properties: {
                            userId: { type: 'string' },
                            name: { type: 'string' },
                            avatar: { type: 'string', format: 'uri' },
                        },
                    },
                    category: { type: 'string', enum: ['recipe', 'review', 'tips', 'news', 'health', 'other'] },
                    tags: { type: 'array', items: { type: 'string' } },
                    status: { type: 'string', enum: ['draft', 'published', 'archived'] },
                    views: { type: 'integer' },
                    likesCount: { type: 'integer' },
                    commentsCount: { type: 'integer' },
                    readTime: { type: 'integer' },
                    publishedAt: { type: 'string', format: 'date-time', nullable: true },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
            },
            Comment: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    blogId: { type: 'string' },
                    parentId: { type: 'string', nullable: true },
                    path: { type: 'string' },
                    content: { type: 'string' },
                    images: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                url: { type: 'string', format: 'uri' },
                                publicId: { type: 'string' },
                                width: { type: 'integer' },
                                height: { type: 'integer' },
                            },
                        },
                    },
                    author: {
                        type: 'object',
                        properties: {
                            userId: { type: 'string' },
                            name: { type: 'string' },
                            avatar: { type: 'string' },
                        },
                    },
                    likesCount: { type: 'integer' },
                    createdAt: { type: 'string', format: 'date-time' },
                },
            },
            UploadResponse: {
                type: 'object',
                properties: {
                    url: { type: 'string', format: 'uri' },
                    publicId: { type: 'string' },
                    width: { type: 'integer' },
                    height: { type: 'integer' },
                    format: { type: 'string' },
                },
            },
        },
    },
    security: [{ bearerAuth: [] }],
    paths: {},
};
