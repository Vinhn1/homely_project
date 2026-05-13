/**
 * @file property.routes.js
 * @description Định nghĩa routes cho Property module
 * 
 * Public routes  → không cần đăng nhập (xem danh sách, xem chi tiết)
 * Private routes → cần đăng nhập (đăng tin, sửa, xóa)
 */
import express from 'express';
import * as propertyController from './property.controller.js';
import { optionalProtect, protect } from '../../middleware/auth.middleware.js';
import { uploadImages } from '../../middleware/upload.middleware.js';

const router = express.Router();

// ── Public Routes ──
// Ai cũng có thể xem danh sách và chi tiết
router.get('/', propertyController.getAllProperties);
router.get('/:id', optionalProtect, propertyController.getPropertyById);

// ── Private Routes (cần đăng nhập) ──
// Chỉ owner mới được đăng tin, sửa, xóa, xem bài đăng của mình
router.use(protect);

router.get('/user/my-listings', propertyController.getMyProperties);

// uploadImages là middleware: Multer xử lý file → upload Cloudinary → req.files chứa kết quả
router.post('/', uploadImages, propertyController.createProperty);
router.patch('/:id', uploadImages, propertyController.updateProperty);
router.delete('/:id', propertyController.deleteProperty);

export default router;
