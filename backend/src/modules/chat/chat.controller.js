import { Conversation, Message } from './chat.model.js';
import Notification from '../notification/notification.model.js';
import catchAsync from '../../utils/catchAsync.js';
import AppError from '../../utils/appError.js';
import mongoose from 'mongoose';

// GET /api/v1/chat/conversations
export const getConversations = catchAsync(async (req, res) => {
    const userId = req.user._id;
    const conversations = await Conversation.find({ participants: userId })
        .populate('participants', 'displayName avatarUrl')
        .populate('lastMessage', 'content createdAt sender')
        .populate('property', 'title images')
        .sort({ lastMessageAt: -1 });

    res.status(200).json({ status: 'success', data: { conversations } });
});

// GET /api/v1/chat/conversations/:conversationId/messages
export const getMessages = catchAsync(async (req, res, next) => {
    const { conversationId } = req.params;
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = 50;

    const conv = await Conversation.findOne({ _id: conversationId, participants: userId });
    if (!conv) return next(new AppError('Không tìm thấy cuộc trò chuyện', 404));

    const messages = await Message.find({ conversation: conversationId })
        .populate('sender', 'displayName avatarUrl')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    // Đánh dấu đã đọc
    await Message.updateMany(
        { conversation: conversationId, sender: { $ne: userId }, isRead: false },
        { isRead: true }
    );
    conv.unreadCount.set(userId.toString(), 0);
    await conv.save();

    res.status(200).json({
        status: 'success',
        data: { messages: messages.reverse() }
    });
});

// POST /api/v1/chat/conversations
export const createOrGetConversation = catchAsync(async (req, res) => {
    const { recipientId, propertyId } = req.body;
    const userId = req.user._id;

    // Kiểm tra đã có conversation chưa
    let conv = await Conversation.findOne({
        participants: { $all: [userId, recipientId] },
        property: propertyId || null
    })
    .populate('participants', 'displayName avatarUrl')
    .populate('property', 'title images');

    if (!conv) {
        conv = await Conversation.create({
            participants: [userId, recipientId],
            property: propertyId || undefined
        });
        conv = await conv.populate([
            { path: 'participants', select: 'displayName avatarUrl' },
            { path: 'property', select: 'title images' }
        ]);
    }

    res.status(200).json({ status: 'success', data: { conversation: conv } });
});

// POST /api/v1/chat/conversations/:conversationId/messages
export const sendMessage = catchAsync(async (req, res, next) => {
    const { conversationId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    const conv = await Conversation.findOne({ _id: conversationId, participants: userId });
    if (!conv) return next(new AppError('Không tìm thấy cuộc trò chuyện', 404));
    if (!content?.trim()) return next(new AppError('Nội dung tin nhắn không được trống', 400));

    const message = await Message.create({
        conversation: conversationId,
        sender: userId,
        content: content.trim()
    });

    const populated = await message.populate('sender', 'displayName avatarUrl');

    // Cập nhật lastMessage và unreadCount
    const otherParticipants = conv.participants.filter(p => p.toString() !== userId.toString());
    for (const pid of otherParticipants) {
        const key = pid.toString();
        conv.unreadCount.set(key, (conv.unreadCount.get(key) || 0) + 1);
    }
    conv.lastMessage = message._id;
    conv.lastMessageAt = new Date();
    await conv.save();

    // Tạo notification cho người nhận
    for (const pid of otherParticipants) {
        await Notification.create({
            recipient: pid,
            type: 'new_message',
            title: 'Tin nhắn mới',
            body: `${req.user.displayName} đã gửi tin nhắn cho bạn`,
            link: `/tin-nhan?conv=${conversationId}`,
            refId: message._id,
            refModel: 'Message'
        });
    }

    // Emit socket event (sẽ được gọi từ socket handler)
    const io = req.app.get('io');
    if (io) {
        io.to(conversationId).emit('new_message', populated);
        for (const pid of otherParticipants) {
            io.to(pid.toString()).emit('notification', { type: 'new_message' });
        }
    }

    res.status(201).json({ status: 'success', data: { message: populated } });
});

// GET /api/v1/chat/unread-count
export const getUnreadCount = catchAsync(async (req, res) => {
    const userId = req.user._id.toString();
    const conversations = await Conversation.find({ participants: req.user._id });
    let total = 0;
    for (const conv of conversations) {
        total += conv.unreadCount.get(userId) || 0;
    }
    res.status(200).json({ status: 'success', data: { unreadCount: total } });
});
