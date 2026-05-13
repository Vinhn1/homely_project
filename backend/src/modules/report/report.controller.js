import Report from './report.model.js';
import Notification from '../notification/notification.model.js';
import catchAsync from '../../utils/catchAsync.js';
import AppError from '../../utils/appError.js';

// POST /api/v1/reports  (user báo cáo bài đăng)
export const createReport = catchAsync(async (req, res, next) => {
    const { propertyId, reason, description } = req.body;
    if (!propertyId || !reason) return next(new AppError('Thiếu thông tin báo cáo', 400));

    // Kiểm tra đã báo cáo chưa
    const existing = await Report.findOne({ reporter: req.user._id, property: propertyId, status: 'pending' });
    if (existing) return next(new AppError('Bạn đã gửi báo cáo cho bài đăng này rồi', 409));

    const report = await Report.create({
        reporter: req.user._id,
        property: propertyId,
        reason,
        description
    });

    res.status(201).json({ status: 'success', data: { report } });
});

// ─── Admin endpoints ────────────────────────────────────────────────────────

// GET /api/v1/admin/reports
export const getReports = catchAsync(async (req, res) => {
    const { status = 'pending', page = 1, limit = 20 } = req.query;
    const filter = status === 'all' ? {} : { status };

    const [reports, total] = await Promise.all([
        Report.find(filter)
            .populate('reporter', 'displayName email avatarUrl')
            .populate('property', 'title images location listingStatus')
            .populate('resolvedBy', 'displayName')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit)),
        Report.countDocuments(filter)
    ]);

    res.status(200).json({ status: 'success', data: { reports, total } });
});

// PATCH /api/v1/admin/reports/:id
export const resolveReport = catchAsync(async (req, res, next) => {
    const { action, adminNote } = req.body;
    // action: 'resolve' | 'dismiss'
    const report = await Report.findById(req.params.id).populate('property');
    if (!report) return next(new AppError('Không tìm thấy báo cáo', 404));

    report.status = action === 'resolve' ? 'resolved' : 'dismissed';
    report.adminNote = adminNote;
    report.resolvedBy = req.user._id;
    report.resolvedAt = new Date();
    await report.save();

    res.status(200).json({ status: 'success', data: { report } });
});
