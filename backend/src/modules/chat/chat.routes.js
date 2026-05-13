import express from 'express';
import * as chatController from './chat.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();
router.use(protect);

router.get('/conversations', chatController.getConversations);
router.post('/conversations', chatController.createOrGetConversation);
router.get('/conversations/:conversationId/messages', chatController.getMessages);
router.post('/conversations/:conversationId/messages', chatController.sendMessage);
router.get('/unread-count', chatController.getUnreadCount);

export default router;
