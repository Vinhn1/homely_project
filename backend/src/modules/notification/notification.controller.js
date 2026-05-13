import Notification from './notification.model.js';
import catchAsync from '../../utils/catchAsync.js';

// GET /api/v1/notifications
export const getNotifications = catchAsync(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const notifications = await Notification.find({ recipient: req.user._id })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    const unreadCount = await Notification.countDocuments({ recipient: req.user._id, isRead: false });

    res.status(200).json({ status: 'success', data: { notifications, unreadCount } });
});

// PATCH /api/v1/notifications/:id/read
export const markAsRead = catchAsync(async (req, res) => {
    await Notification.findOneAndUpdate(
        { _id: req.params.id, recipient: req.user._id },
        { isRead: true }
    );
    res.status(200).json({ status: 'success' });
});

// PATCH /api/v1/notifications/read-all
export const markAllAsRead = catchAsync(async (req, res) => {
    await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
    res.status(200).json({ status: 'success' });
});

// DELETE /api/v1/notifications/:id
export const deleteNotification = catchAsync(async (req, res) => {
    await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user._id });
    res.status(204).json({ status: 'success' });
});
