import express from 'express';
import blogController from '../controllers/blogController.js';
import commentRoutes from './commentRoutes.js';
import uploadRoutes from './uploadRoutes.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Blogs
 *     description: Quản lý bài viết blog
 */

/**
 * @swagger
 * /api/blogs:
 *   post:
 *     summary: Tạo bài viết mới (có upload ảnh bìa)
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
 *                 example: "Top 10 quán chay ngon nhất Hà Nội 2025"
 *               content:
 *                 type: string
 *                 example: "<h2>Ăn chay đang là xu hướng!</h2><p>Mình đã đi thử hết 10 quán này...</p>"
 *               excerpt:
 *                 type: string
 *                 example: "Top 10 quán chay ngon nhất Hà Nội năm 2025 – từ bình dân đến cao cấp!"
 *               category:
 *                 type: string
 *                 enum: [recipe, review, tips, news, health, other]
 *                 example: review
 *               tags:
 *                 type: string
 *                 example: "chay,hà nội,ẩm thực,quán ngon"
 *               featuredImage:
 *                 type: string
 *                 format: binary
 *                 description: Ảnh bìa bài viết
 *               author.userId:
 *                 type: string
 *                 example: "60d5ecb74b3d3f001c8b4567"
 *               author.name:
 *                 type: string
 *                 example: "Nguyễn Văn A"
 *               author.avatar:
 *                 type: string
 *                 example: "https://ui-avatars.com/api/?name=Nguyen+Van+A"
 *     responses:
 *       201:
 *         description: Tạo bài viết thành công
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Blog created successfully"
 *               data:
 *                 _id: "67a1b2c3d4e5f67890123456"
 *                 title: "Top 10 quán chay ngon nhất Hà Nội 2025"
 *                 slug: "top-10-quan-chay-ngon-nhat-ha-noi-2025-abc123xyz"
 *                 excerpt: "Top 10 quán chay ngon nhất..."
 *                 featuredImage:
 *                   url: "https://res.cloudinary.com/dhaecxi8n/image/upload/v1733150000/blog/chay_hanoi_cover.jpg"
 *                 author:
 *                   userId: "60d5ecb74b3d3f001c8b4567"
 *                   name: "Nguyễn Văn A"
 *                 category: "review"
 *                 status: "draft"
 *                 views: 0
 *                 likesCount: 0
 *                 commentsCount: 0
 *                 readTime: 6
 *                 createdAt: "2025-12-04T10:00:00.000Z"
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
 *         schema:
 *           type: integer
 *           default: 1
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         example: 10
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [recipe, review, tips, news, health, other]
 *         example: review
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: chay Hà Nội
 *     responses:
 *       200:
 *         description: Danh sách bài viết
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - _id: "67a1b2c3d4e5f67890123456"
 *                   title: "Top 10 quán chay ngon nhất Hà Nội 2025"
 *                   slug: "top-10-quan-chay-ngon-nhat-ha-noi-2025-abc123xyz"
 *                   excerpt: "Top 10 quán chay ngon nhất..."
 *                   featuredImage:
 *                     url: "https://res.cloudinary.com/..."
 *                   author:
 *                     name: "Nguyễn Văn A"
 *                   category: "review"
 *                   views: 2580
 *                   likesCount: 142
 *                   commentsCount: 28
 *                   readTime: 6
 *                   publishedAt: "2025-12-03T10:00:00.000Z"
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
 *         schema:
 *           type: integer
 *           default: 5
 *           maximum: 20
 *         example: 5
 *     responses:
 *       200:
 *         description: Danh sách bài viết hot
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - title: "Phở bò Kobe Hà Nội - Có thật không?"
 *                   slug: "pho-bo-kobe-ha-noi-co-that-khong-xyz789"
 *                   excerpt: "Tin đồn phở bò Kobe giá 2 triệu..."
 *                   featuredImage:
 *                     url: "https://res.cloudinary.com/..."
 *                   views: 18900
 *                   likesCount: 1200
 *                   commentsCount: 89
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
 *         schema:
 *           type: string
 *         example: top-10-quan-chay-ngon-nhat-ha-noi-2025-abc123xyz
 *     responses:
 *       200:
 *         description: Chi tiết bài viết
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       404:
 *         description: Không tìm thấy
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
 *         example: 67a1b2c3d4e5f67890123456
 *     responses:
 *       200:
 *         description: Chi tiết bài viết
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
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
 *         example: 67a1b2c3d4e5f67890123456
 *     responses:
 *       200:
 *         description: Like thành công
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Blog liked successfully"
 *               likesCount: 143
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
 *               title: { type: string, example: "Top 10 quán chay ngon nhất Hà Nội 2026" }
 *               content: { type: string }
 *               featuredImage: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *
 *   delete:
 *     summary: Xóa bài viết (chỉ owner hoặc admin)
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

router.use('/upload', uploadRoutes);
router.use('/:blogId/comments', commentRoutes);

router.post('/', blogController.createBlog);
router.get('/', blogController.getBlogs);
router.get('/popular', blogController.getPopularBlogs);
router.get('/slug/:slug', blogController.getBlogBySlug);
router.get('/:blogId', blogController.getBlogById);
router.put('/:blogId', blogController.updateBlog);
router.delete('/:blogId', blogController.deleteBlog);
router.post('/:blogId/like', blogController.toggleLike);

export default router;
