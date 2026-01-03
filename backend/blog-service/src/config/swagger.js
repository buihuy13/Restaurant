// src/config/openapi.js
import { readFileSync } from 'fs';
import path from 'path';

const packageJson = JSON.parse(readFileSync(path.resolve('package.json'), 'utf-8'));

export const blogServiceOpenAPI = {
    openapi: '3.0.3',
    info: {
        title: 'FoodEats - Blog Service API',
        version: packageJson.version || '1.0.0',
        description: `
**Blog Service** 

**Tính năng nổi bật:**
- Viết blog công thức nấu ăn, review quán, mẹo vặt bếp núc
- Bình luận lồng ghép (nested comments) – tranh luận thoải mái
- Upload ảnh trực tiếp từ bài viết & bình luận (Cloudinary)
- Like bài viết & bình luận
- Tự động tạo slug, excerpt, thời gian đọc
- SEO tối ưu: slug đẹp, meta, OpenGraph
- Full-text search + phân trang + lọc theo category/tag
- JWT bảo mật + phân quyền rõ ràng
        `.trim(),
        contact: {
            name: 'CNTTK18 Dev Team',
        },
    },
    servers: [
        {
            url: 'http://localhost:8080/api/blogs',
            description: 'Local Development (via API Gateway)',
        },
        // {
        //     url: 'https://api.foodeats.vn/api/blogs',
        //     description: 'Production',
        // },
    ],
    tags: [
        {
            name: 'Blogs',
            description: 'Quản lý bài viết blog – công thức, review, mẹo hay',
        },
        {
            name: 'Comments',
            description: 'Bình luận & trả lời theo cây (nested)',
        },
        {
            name: 'Upload',
            description: 'Upload & xóa ảnh Cloudinary (bìa, ảnh trong comment)',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Nhập JWT token từ User/Auth Service (Bearer &lt;token&gt;)',
            },
        },
        schemas: {
            // ==================== BLOG ====================
            Blog: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '67a1b2c3d4e5f67890123456' },
                    title: { type: 'string', example: 'Top 10 quán phở ngon nhất Hà Nội 2025' },
                    slug: { type: 'string', example: 'top-10-quan-pho-ngon-nhat-ha-noi-2025-abc123' },
                    excerpt: { type: 'string', example: 'Mình đã đi ăn hết 10 quán này...' },
                    content: { type: 'string', example: '<h2>1. Phở Thìn</h2><p>Nguyên bản...</p>' },
                    featuredImage: {
                        type: 'object',
                        properties: {
                            url: { type: 'string', format: 'uri' },
                            publicId: { type: 'string' },
                            width: { type: 'integer' },
                            height: { type: 'integer' },
                        },
                    },
                    author: {
                        type: 'object',
                        properties: {
                            userId: { type: 'string' },
                            name: { type: 'string', example: 'Nguyễn Văn A' },
                            avatar: { type: 'string', format: 'uri' },
                        },
                    },
                    category: {
                        type: 'string',
                        enum: ['recipe', 'review', 'tips', 'news', 'health', 'other'],
                        example: 'review',
                    },
                    tags: {
                        type: 'array',
                        items: { type: 'string' },
                        example: ['phở', 'hà nội', 'ẩm thực', 'quán ngon'],
                    },
                    status: {
                        type: 'string',
                        enum: ['draft', 'published', 'archived'],
                        example: 'published',
                    },
                    views: { type: 'integer', example: 12580 },
                    likesCount: { type: 'integer', example: 842 },
                    commentsCount: { type: 'integer', example: 67 },
                    readTime: { type: 'integer', example: 8 },
                    publishedAt: { type: 'string', format: 'date-time', nullable: true },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
            },

            // ==================== COMMENT ====================
            Comment: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    blogId: { type: 'string' },
                    parentId: { type: 'string', nullable: true },
                    path: { type: 'string', example: '0001.0002.0003' },
                    content: { type: 'string', example: 'Mình thấy quán này ngon hơn!' },
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
                            avatar: { type: 'string', format: 'uri' },
                        },
                    },
                    likesCount: { type: 'integer', example: 12 },
                    createdAt: { type: 'string', format: 'date-time' },
                },
            },

            // ==================== UPLOAD ====================
            UploadResponse: {
                type: 'object',
                properties: {
                    url: { type: 'string', format: 'uri' },
                    publicId: { type: 'string' },
                    width: { type: 'integer' },
                    height: { type: 'integer' },
                    format: { type: 'string', example: 'jpg' },
                },
            },

            // ==================== ERROR ====================
            ErrorResponse: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Blog not found' },
                },
            },
        },
    },
    security: [{ bearerAuth: [] }], // áp dụng JWT toàn cục
    paths: {}, // sẽ được swagger-jsdoc tự sinh từ @swagger trong routes
};
