import express from 'express';
import * as categoryController from './category.controller.js';
// import { protect } from '../../middleware/auth.middleware.js'; // Bật nếu muốn bảo vệ route tạo

const router = express.Router();

router.get('/', categoryController.getAllCategories);
router.post('/', categoryController.createCategory); // Tạm thời để public để bạn dễ test/seed

export default router;
