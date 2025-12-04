import cloudinary from '../config/cloudinary.js';
import logger from '../utils/logger.js';
import { Readable } from 'stream';

class CloudinaryService {
    /**
     * Upload image from buffer to Cloudinary
     * @param {Buffer} buffer - Image buffer
     * @param {String} folder - Cloudinary folder
     * @param {String} filename - Original filename
     * @returns {Promise<Object>} Upload result
     */
    async uploadImage(buffer, folder = 'foodeats/blogs', filename = '') {
        try {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: folder,
                        public_id: filename ? `${Date.now()}_${filename}` : undefined,
                        resource_type: 'auto',
                        transformation: [
                            { width: 1200, height: 630, crop: 'limit' }, // Max size
                            { quality: 'auto:good' }, // Automatic quality optimization
                            { fetch_format: 'auto' }, // Automatic format selection
                        ],
                    },
                    (error, result) => {
                        if (error) {
                            logger.error('Cloudinary upload error:', error);
                            reject(error);
                        } else {
                            logger.info(`Image uploaded to Cloudinary: ${result.public_id}`);
                            resolve(result);
                        }
                    },
                );

                // Convert buffer to stream and pipe to Cloudinary
                const bufferStream = Readable.from(buffer);
                bufferStream.pipe(uploadStream);
            });
        } catch (error) {
            logger.error('Upload image error:', error);
            throw error;
        }
    }

    /**
     * Upload multiple images
     * @param {Array} files - Array of file objects with buffer
     * @param {String} folder - Cloudinary folder
     * @returns {Promise<Array>} Array of upload results
     */
    async uploadMultipleImages(files, folder = 'foodeats/blogs') {
        try {
            const uploadPromises = files.map((file) => this.uploadImage(file.buffer, folder, file.originalname));

            const results = await Promise.all(uploadPromises);
            logger.info(`${results.length} images uploaded successfully`);
            return results;
        } catch (error) {
            logger.error('Upload multiple images error:', error);
            throw error;
        }
    }

    /**
     * Delete image from Cloudinary
     * @param {String} publicId - Cloudinary public ID
     * @returns {Promise<Object>} Delete result
     */
    async deleteImage(publicId) {
        try {
            const result = await cloudinary.uploader.destroy(publicId);
            logger.info(`Image deleted from Cloudinary: ${publicId}`);
            return result;
        } catch (error) {
            logger.error('Delete image error:', error);
            throw error;
        }
    }

    /**
     * Delete multiple images
     * @param {Array} publicIds - Array of Cloudinary public IDs
     * @returns {Promise<Object>} Delete result
     */
    async deleteMultipleImages(publicIds) {
        try {
            const result = await cloudinary.api.delete_resources(publicIds);
            logger.info(`${publicIds.length} images deleted from Cloudinary`);
            return result;
        } catch (error) {
            logger.error('Delete multiple images error:', error);
            throw error;
        }
    }

    /**
     * Get image details
     * @param {String} publicId - Cloudinary public ID
     * @returns {Promise<Object>} Image details
     */
    async getImageDetails(publicId) {
        try {
            const result = await cloudinary.api.resource(publicId);
            return result;
        } catch (error) {
            logger.error('Get image details error:', error);
            throw error;
        }
    }

    /**
     * Generate thumbnail URL
     * @param {String} publicId - Cloudinary public ID
     * @param {Number} width - Thumbnail width
     * @param {Number} height - Thumbnail height
     * @returns {String} Thumbnail URL
     */
    generateThumbnailUrl(publicId, width = 300, height = 200) {
        return cloudinary.url(publicId, {
            width: width,
            height: height,
            crop: 'fill',
            gravity: 'auto',
            quality: 'auto:good',
            fetch_format: 'auto',
        });
    }

    /**
     * Generate optimized image URL
     * @param {String} publicId - Cloudinary public ID
     * @param {Object} options - Transformation options
     * @returns {String} Optimized image URL
     */
    generateOptimizedUrl(publicId, options = {}) {
        return cloudinary.url(publicId, {
            quality: 'auto:good',
            fetch_format: 'auto',
            ...options,
        });
    }

    /**
     * Extract public ID from Cloudinary URL
     * @param {String} url - Cloudinary URL
     * @returns {String} Public ID
     */
    extractPublicId(url) {
        try {
            if (!url) return null;

            // Extract public ID from Cloudinary URL
            const parts = url.split('/');
            const uploadIndex = parts.indexOf('upload');

            if (uploadIndex === -1) return null;

            // Get everything after 'upload' and version number
            const pathParts = parts.slice(uploadIndex + 2);
            const publicIdWithExt = pathParts.join('/');

            // Remove file extension
            const publicId = publicIdWithExt.replace(/\.[^/.]+$/, '');

            return publicId;
        } catch (error) {
            logger.error('Extract public ID error:', error);
            return null;
        }
    }
}

export default new CloudinaryService();
