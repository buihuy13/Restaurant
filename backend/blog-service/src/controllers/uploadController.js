import logger from '../utils/logger.js';
import CloudinaryService from '../services/cloudinaryService.js';

class UploadController {
    /**
     * Upload single image for rich text editor
     * Used when user clicks image button in editor toolbar
     */
    uploadEditorImage = async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No image file provided',
                });
            }

            logger.info('Editor image upload:', {
                originalname: req.file.originalname,
                size: req.file.size,
                mimetype: req.file.mimetype,
            });

            // Upload to Cloudinary
            const result = await CloudinaryService.uploadImage(
                req.file.buffer,
                'foodeats/blogs/editor',
                req.file.originalname,
            );

            logger.info(`Editor image uploaded: ${result.public_id}`);

            // Return URL for editor to insert into markdown
            return res.status(200).json({
                success: true,
                data: {
                    url: result.secure_url,
                    publicId: result.public_id,
                    width: result.width,
                    height: result.height,
                },
            });
        } catch (error) {
            logger.error('Upload editor image error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to upload image',
                error: error.message,
            });
        }
    };

    /**
     * Upload multiple images at once
     */
    uploadMultipleImages = async (req, res) => {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No images provided',
                });
            }

            logger.info(`Uploading ${req.files.length} images`);

            const uploadPromises = req.files.map(async (file) => {
                const result = await CloudinaryService.uploadImage(
                    file.buffer,
                    'foodeats/blogs/editor',
                    file.originalname,
                );
                return {
                    url: result.secure_url,
                    publicId: result.public_id,
                    width: result.width,
                    height: result.height,
                };
            });

            const uploadedImages = await Promise.all(uploadPromises);

            return res.status(200).json({
                success: true,
                data: uploadedImages,
            });
        } catch (error) {
            logger.error('Upload multiple images error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to upload images',
                error: error.message,
            });
        }
    };
}

export default new UploadController();
