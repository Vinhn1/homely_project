import express from 'express';
import * as notifController from './notification.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();
router.use(protect);

router.get('/', notifController.getNotifications);
router.patch('/read-all', notifController.markAllAsRead);
router.patch('/:id/read', notifController.markAsRead);
router.delete('/:id', notifController.deleteNotification);

export default router;
