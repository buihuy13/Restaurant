import express from 'express';
import blogController from '../controllers/blogController.js';
import commentRoutes from './commentRoutes.js';
import uploadRoutes from './uploadRoutes.js';

/**
 * @swagger
 * tags:
 *   - name: Blogs
 *     description: Quản lý bài viết blog
 *   - name: Comments
 *     description: Bình luận & trả lời
 *   - name: Upload
 *     description: Upload ảnh riêng biệt
 */

/**
 * @swagger
 * /api/blogs:
 *   post:
 *     summary: Tạo bài viết mới (hỗ trợ ảnh bìa)
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - author.userId
 *               - author.name
 *             properties:
 *               title:
 *                 type: string
 *                 example: Top 10 món chay ngon nhất Hà Nội 2025
 *               content:
 *                 type: string
 *                 example: |
 *                   <h2>Ăn chay không còn nhàm chán!</h2>
 *                   <p>Sau đây là danh sách 10 quán chay mình tâm đắc nhất...</p>
 *                   <ul>
 *                     <li>Quán 1: Chay Mộc</li>
 *                     <li>Quán 2: Loving Hut</li>
 *                   </ul>
 *               excerpt:
 *                 type: string
 *                 example: Khám phá ngay 10 quán chay ngon nhất thủ đô năm 2025 – từ bình dân đến cao cấp!
 *               category:
 *                 type: string
 *                 enum: [recipe, review, tips, news, health, other]
 *                 example: review
 *               tags:
 *                 type: string
 *                 example: chay, hà nội, ẩm thực, ăn uống, quán ngon
 *               featuredImage:
 *                 type: string
 *                 format: binary
 *                 description: Ảnh bìa bài viết (jpg, png, webp)
 *               author.userId:
 *                 type: string
 *                 example: 60d5ecb74b3d3f001c8b4567
 *               author.name:
 *                 type: string
 *                 example: Nguyễn Văn A
 *               author.avatar:
 *                 type: string
 *                 format: url
 *                 example: https://ui-avatars.com/api/?name=Nguyen+Van+A&background=random
 *     responses:
 *       201:
 *         description: Tạo bài viết thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Blog created successfully
 *                 data:
 *                   type: object
 *                   # ← Swagger sẽ hiển thị đẹp hơn khi dùng schema rõ ràng
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 67a1b2c3d4e5f67890123456
 *                     title:
 *                       type: string
 *                       example: Top 10 món chay ngon nhất Hà Nội 2025
 *                     slug:
 *                       type: string
 *                       example: top-10-mon-chay-ngon-nhat-ha-noi-2025-n9x7k2p8m
 *                     excerpt:
 *                       type: string
 *                       example: Khám phá ngay 10 quán chay ngon nhất thủ đô năm 2025...
 *                     content:
 *                       type: string
 *                     featuredImage:
 *                       type: string
 *                       format: url
 *                       example: https://res.cloudinary.com/dhaecxi8n/image/upload/v1733150000/blog/cover_xyz123.jpg
 *                     author:
 *                       type: object
 *                       properties:
 *                         userId:
 *                           type: string
 *                           example: 60d5ecb74b3d3f001c8b4567
 *                         name:
 *                           type: string
 *                           example: Nguyễn Văn A
 *                         avatar:
 *                           type: string
 *                           example: https://ui-avatars.com/api/?name=Nguyen+Van+A&background=random
 *                     category:
 *                       type: string
 *                       example: review
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["chay", "hà nội", "ẩm thực"]
 *                     status:
 *                       type: string
 *                       example: draft
 *                     views:
 *                       type: integer
 *                       example: 0
 *                     likesCount:
 *                       type: integer
 *                       example: 0
 *                     commentsCount:
 *                       type: integer
 *                       example: 0
 *                     readTime:
 *                       type: integer
 *                       example: 7
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-12-02T10:30:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-12-02T10:30:00.000Z
 */

/**
 * @swagger
 * /api/blogs:
 *   get:
 *     summary: Lấy danh sách bài viết (phân trang + lọc)
 *     tags: [Blogs]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1, minimum: 1 }
 *         description: Trang hiện tại
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10, maximum: 50 }
 *       - in: query
 *         name: category
 *         schema: { type: string, enum: [recipe, review, tips, news, health, other] }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Tìm kiếm theo từ khóa (title, content, tags)
 *     responses:
 *       200:
 *         description: Danh sách bài viết
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Blogs retrieved successfully"
 *               data:
 *                 - _id: "67a1b2c3d4e5f6789012345"
 *                   title: "Top 10 món chay ngon nhất Hà Nội 2025"
 *                   slug: "top-10-mon-chay-ngon-nhat-ha-noi-2025-l2m9x7p3q"
 *                   excerpt: "Khám phá ngay 10 quán chay ngon nhất..."
 *                   featuredImage: "https://res.cloudinary.com/..."
 *                   author:
 *                     name: "Nguyễn Văn A"
 *                   category: "review"
 *                   views: 1250
 *                   likesCount: 89
 *                   commentsCount: 24
 *                   readTime: 6
 *                   publishedAt: "2025-12-01T10:00:00.000Z"
 *               pagination:
 *                 page: 1
 *                 limit: 10
 *                 total: 156
 *                 pages: 16
 */

/**
 * @swagger
 * /api/blogs/popular:
 *   get:
 *     summary: Lấy bài viết nổi bật (theo lượt xem)
 *     tags: [Blogs]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 5, maximum: 20 }
 *     responses:
 *       200:
 *         description: Danh sách bài viết nổi bật
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - title: "Phở bò Kobe Hà Nội - Có thật không?"
 *                   slug: "pho-bo-kobe-ha-noi-co-that-khong-xyz789"
 *                   excerpt: "Tin đồn phở bò Kobe giá 2 triệu..."
 *                   featuredImage: "https://res.cloudinary.com/..."
 *                   views: 15890
 *                   likesCount: 1200
 */

/**
 * @swagger
 * /api/blogs/slug/{slug}:
 *   get:
 *     summary: Lấy bài viết theo slug (tăng view tự động)
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *         example: top-10-mon-chay-ngon-nhat-ha-noi-2025-l2m9x7p3q
 *     responses:
 *       200:
 *         description: Chi tiết bài viết
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Blog'
 *       404:
 *         description: Không tìm thấy bài viết
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Blog not found"
 */

/**
 * @swagger
 * /api/blogs/{blogId}:
 *   get:
 *     summary: Lấy bài viết theo ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema: { type: string }
 *         example: 67a1b2c3d4e5f6789012345
 *     responses:
 *       200:
 *         description: Chi tiết bài viết
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Blog'
 */

/**
 * @swagger
 * /api/blogs/{blogId}/related:
 *   get:
 *     summary: Lấy bài viết liên quan
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 3 }
 *     responses:
 *       200:
 *         description: Danh sách bài viết liên quan
 */

/**
 * @swagger
 * /api/blogs/{blogId}/like:
 *   post:
 *     summary: Like / Unlike bài viết
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Like thành công
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Blog liked successfully"
 *               likesCount: 157
 *               liked: true
 */

/**
 * @swagger
 * /api/blogs/{blogId}:
 *   put:
 *     summary: Cập nhật bài viết
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *               featuredImage: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *
 *   delete:
 *     summary: Xóa bài viết
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *     responses:
 *       200:
 *         description: Xóa thành công
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Blog deleted successfully"
 */

const router = express.Router();

// Upload routes
router.use('/upload', uploadRoutes);

// Blog routes
router.get('/popular', blogController.getPopularBlogs);
router.post('/', blogController.createBlog);
router.get('/', blogController.getBlogs);
router.get('/:blogId', blogController.getBlogById);
router.get('/:blogId/related', blogController.getRelatedBlogs);
router.get('/slug/:slug', blogController.getBlogBySlug);
router.put('/:blogId', blogController.updateBlog);
router.delete('/:blogId', blogController.deleteBlog);
router.post('/:blogId/like', blogController.toggleLike);

// Comment routes - tách riêng
router.use('/:blogId/comments', commentRoutes);

export default router;
