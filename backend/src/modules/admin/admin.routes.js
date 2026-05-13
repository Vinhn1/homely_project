import express from 'express';
import { protect, restrictTo } from '../../middleware/auth.middleware.js';
import Property from '../property/property.model.js';
import User from '../auth/user.model.js';
import { getReports, resolveReport } from '../report/report.controller.js';
import Notification from '../notification/notification.model.js';
import catchAsync from '../../utils/catchAsync.js';
import AppError from '../../utils/appError.js';

const router = express.Router();
router.use(protect, restrictTo('admin'));

// ─── Dashboard Stats ─────────────────────────────────────────────────────────
router.get('/stats', catchAsync(async (req, res) => {
    const [totalProperties, pendingProperties, totalUsers, pendingReports] = await Promise.all([
        Property.countDocuments(),
        Property.countDocuments({ listingStatus: 'pending' }),
        User.countDocuments(),
        (await import('../report/report.model.js')).default.countDocuments({ status: 'pending' })
    ]);
    res.status(200).json({ status: 'success', data: { totalProperties, pendingProperties, totalUsers, pendingReports } });
}));

// ─── Quản lý bài đăng ────────────────────────────────────────────────────────
router.get('/properties', catchAsync(async (req, res) => {
    const { status = 'pending', page = 1, limit = 20, keyword } = req.query;
    const filter = { listingStatus: status };
    if (keyword) filter.title = { $regex: keyword, $options: 'i' };

    const [properties, total] = await Promise.all([
        Property.find(filter)
            .populate('owner', 'displayName email avatarUrl phone')
            .populate('category', 'name')
            .sort({ createdAt: -1 })
            .skip((page - 1) * parseInt(limit))
            .limit(parseInt(limit)),
        Property.countDocuments(filter)
    ]);

    res.status(200).json({ status: 'success', data: { properties, total } });
}));

// PATCH /api/v1/admin/properties/:id/status
router.patch('/properties/:id/status', catchAsync(async (req, res, next) => {
    const { status, reason } = req.body;
    const allowedStatuses = ['pending', 'active', 'hidden', 'expired'];

    if (!allowedStatuses.includes(status)) {
        return next(new AppError('Trạng thái bài đăng không hợp lệ', 400));
    }

    const property = await Property.findById(req.params.id);
    if (!property) return next(new AppError('Không tìm thấy bài đăng', 404));

    property.listingStatus = status;
    await property.save();

    // Thông báo cho chủ nhà
    const notifTitle = status === 'active' ? 'Bài đăng đã được duyệt' : 'Bài đăng bị ẩn';
    const notifBody = status === 'active'
        ? `Bài đăng "${property.title}" của bạn đã được phê duyệt.`
        : `Bài đăng "${property.title}" đã bị ẩn. ${reason ? 'Lý do: ' + reason : ''}`;

    await Notification.create({
        recipient: property.owner,
        type: status === 'active' ? 'property_approved' : 'property_rejected',
        title: notifTitle,
        body: notifBody,
        link: `/property/${property._id}`
    });

    const io = req.app.get('io');
    if (io) io.to(property.owner.toString()).emit('notification', { type: 'property_status' });

    res.status(200).json({ status: 'success', data: { property } });
}));

// ─── Quản lý người dùng ──────────────────────────────────────────────────────
router.get('/users', catchAsync(async (req, res) => {
    const { page = 1, limit = 20, keyword } = req.query;
    const filter = {};
    if (keyword) filter.$or = [
        { displayName: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } }
    ];

    const [users, total] = await Promise.all([
        User.find(filter).select('-password -refreshTokens').sort({ createdAt: -1 })
            .skip((page - 1) * parseInt(limit)).limit(parseInt(limit)),
        User.countDocuments(filter)
    ]);
    res.status(200).json({ status: 'success', data: { users, total } });
}));

router.patch('/users/:id/ban', catchAsync(async (req, res, next) => {
    const { isBanned, banReason } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError('Không tìm thấy người dùng', 404));
    if (user.role === 'admin') return next(new AppError('Không thể khóa tài khoản admin', 403));

    user.isBanned = Boolean(isBanned);
    user.banReason = user.isBanned ? (banReason || 'Tài khoản vi phạm chính sách hệ thống') : null;
    if (user.isBanned) {
        user.refreshTokens = [];
    }
    await user.save();

    res.status(200).json({ status: 'success', data: { user } });
}));

router.patch('/users/:id/role', catchAsync(async (req, res, next) => {
    const { role } = req.body;
    const allowedRoles = ['user', 'owner'];

    if (!allowedRoles.includes(role)) {
        return next(new AppError('Vai trò người dùng không hợp lệ', 400));
    }

    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError('Không tìm thấy người dùng', 404));
    if (user.role === 'admin') return next(new AppError('Không thể thay đổi vai trò admin', 403));
    if (user.isBanned) return next(new AppError('Không thể đổi vai trò tài khoản đang bị khóa', 403));

    user.role = role;
    user.ownerRequestStatus = role === 'owner' ? 'approved' : null;
    await user.save();

    res.status(200).json({ status: 'success', data: { user } });
}));

// ─── Báo cáo vi phạm ─────────────────────────────────────────────────────────
router.get('/reports', getReports);
router.patch('/reports/:id', resolveReport);

export default router;
