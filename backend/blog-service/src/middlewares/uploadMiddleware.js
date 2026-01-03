import multer from 'multer';
import cloudinaryService from '../services/cloudinaryService.js';

// Multer: nhận file vào RAM (không ghi đĩa)
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 8 * 1024 * 1024 }, // 8MB/ảnh
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp|gif/;
        const ext = file.originalname.toLowerCase().split('.').pop();
        if (allowed.test(file.mimetype) && allowed.test(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận ảnh: jpg, png, webp, gif'));
        }
    },
});

// Middleware chính: upload lên Cloudinary + tự động cleanup
export const uploadCommentImages = [
    upload.array('images', 5), // tối đa 5 ảnh, field name: "images"

    async (req, res, next) => {
        if (!req.files || req.files.length === 0) return next();

        const uploadedIds = []; // để xóa nếu lỗi sau

        try {
            const uploadPromises = req.files.map(async (file) => {
                const result = await cloudinaryService.uploadImage(
                    file.buffer,
                    'foodeats/comments',
                    `comment_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                );

                uploadedIds.push(result.public_id);

                return {
                    url: result.secure_url,
                    public_id: result.public_id,
                    width: result.width,
                    height: result.height,
                    format: result.format,
                };
            });

            req.files = await Promise.all(uploadPromises); // ghi đè req.files

            // Tự động xóa nếu response lỗi (400, 500...)
            const cleanup = () => {
                if (res.statusCode >= 400 && uploadedIds.length > 0) {
                    cloudinaryService.deleteMultipleImages(uploadedIds).catch(() => {});
                }
            };
            res.on('finish', cleanup);
            res.on('close', cleanup);

            next();
        } catch (err) {
            // Upload fail → xóa ảnh đã up
            if (uploadedIds.length > 0) {
                cloudinaryService.deleteMultipleImages(uploadedIds).catch(() => {});
            }
            return res.status(500).json({
                success: false,
                message: 'Upload ảnh thất bại: ' + err.message,
            });
        }
    },
];
