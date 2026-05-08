/**
 * @file upload.middleware.js
 * @description Cấu hình Multer + Cloudinary để upload ảnh lên cloud.
 * Flow: File từ client → Multer (parse multipart) → Cloudinary (lưu cloud) → trả về URL
 */
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Cấu hình Cloudinary với credentials từ .env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cấu hình storage: file được upload thẳng lên Cloudinary (không lưu local)
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        // Thư mục trên Cloudinary
        folder: 'homely/properties',
        // Chỉ cho phép định dạng ảnh
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        // Tự động tối ưu chất lượng ảnh
        transformation: [{ width: 1200, height: 900, crop: 'limit', quality: 'auto' }]
    }
});

// Kiểm tra file type trước khi upload
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận file ảnh!'), false);
    }
};

// Tạo multer instance với giới hạn: tối đa 10 ảnh, mỗi ảnh max 5MB
export const uploadImages = multer({
    storage,
    fileFilter,
    limits: {
        files: 10,
        fileSize: 5 * 1024 * 1024 // 5MB
    }
}).array('images', 10);
