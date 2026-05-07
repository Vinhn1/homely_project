/**
 * @file auth.routes.js
 * @description Định nghĩa các điểm cuối (endpoints) cho module xác thực.
 */

import express from 'express';
import * as authController from './auth.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/logout', protect, authController.logout);

router.get('/me', protect, authController.getMe);


export default router;