import { v2 as cloudinary } from 'cloudinary';
import logger from '../utils/logger.js';

logger.info('Cloudinary Config:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'OK' : 'MISSING',
    api_key: process.env.CLOUDINARY_API_KEY ? 'OK' : 'MISSING',
    api_secret: process.env.CLOUDINARY_API_SECRET ? 'OK (hidden)' : 'MISSING',
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const testCloudinaryConnection = async () => {
    try {
        const result = await cloudinary.api.ping();
        logger.info('Cloudinary connected successfully', result);
    } catch (error) {
        logger.error('Cloudinary connection failed:', {
            message: error.message,
            status: error.http_code,
        });
    }
};

testCloudinaryConnection();

export default cloudinary;
