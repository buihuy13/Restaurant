// ========== src/controllers/uploadController.js ==========
import cloudinaryService from '../services/cloudinaryService.js';
import logger from '../utils/logger.js';

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Image upload API
 */

class UploadController {
    /**
     * @swagger
     * /api/blogs/upload/image:
     *   post:
     *     summary: Upload a single image
     *     tags: [Upload]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               image:
     *                 type: string
     *                 format: binary
     *     responses:
     *       200:
     *         description: Image uploaded successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 message:
     *                   type: string
     *                 data:
     *                   type: object
     *                   properties:
     *                     url:
     *                       type: string
     *                     publicId:
     *                       type: string
     *                     thumbnailUrl:
     *                       type: string
     */
    async uploadSingleImage(req, res, next) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No image file provided',
                });
            }

            const folder = process.env.CLOUDINARY_FOLDER || 'foodeats/blogs';
            const result = await cloudinaryService.uploadImage(req.file.buffer, folder, req.file.originalname);

            res.status(200).json({
                success: true,
                message: 'Image uploaded successfully',
                data: {
                    url: result.secure_url,
                    publicId: result.public_id,
                    thumbnailUrl: cloudinaryService.generateThumbnailUrl(result.public_id),
                    width: result.width,
                    height: result.height,
                    format: result.format,
                    size: result.bytes,
                },
            });
        } catch (error) {
            logger.error('Upload single image controller error:', error);
            next(error);
        }
    }

    /**
     * @swagger
     * /api/blogs/upload/images:
     *   post:
     *     summary: Upload multiple images
     *     tags: [Upload]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               images:
     *                 type: array
     *                 items:
     *                   type: string
     *                   format: binary
     *     responses:
     *       200:
     *         description: Images uploaded successfully
     */
    async uploadMultipleImages(req, res, next) {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No image files provided',
                });
            }

            const folder = process.env.CLOUDINARY_FOLDER || 'foodeats/blogs';
            const results = await cloudinaryService.uploadMultipleImages(req.files, folder);

            const images = results.map((result) => ({
                url: result.secure_url,
                publicId: result.public_id,
                thumbnailUrl: cloudinaryService.generateThumbnailUrl(result.public_id),
                width: result.width,
                height: result.height,
                format: result.format,
                size: result.bytes,
            }));

            res.status(200).json({
                success: true,
                message: `${images.length} images uploaded successfully`,
                data: images,
            });
        } catch (error) {
            logger.error('Upload multiple images controller error:', error);
            next(error);
        }
    }

    /**
     * @swagger
     * /api/blogs/upload/delete:
     *   delete:
     *     summary: Delete an image
     *     tags: [Upload]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               publicId:
     *                 type: string
     *               url:
     *                 type: string
     *     responses:
     *       200:
     *         description: Image deleted successfully
     */
    async deleteImage(req, res, next) {
        try {
            const { publicId, url } = req.body;

            if (!publicId && !url) {
                return res.status(400).json({
                    success: false,
                    message: 'Public ID or URL is required',
                });
            }

            const imagePublicId = publicId || cloudinaryService.extractPublicId(url);

            if (!imagePublicId) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid public ID or URL',
                });
            }

            await cloudinaryService.deleteImage(imagePublicId);

            res.status(200).json({
                success: true,
                message: 'Image deleted successfully',
            });
        } catch (error) {
            logger.error('Delete image controller error:', error);
            next(error);
        }
    }
}

export default new UploadController();
