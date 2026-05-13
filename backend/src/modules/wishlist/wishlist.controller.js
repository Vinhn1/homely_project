import User from '../auth/user.model.js';
import catchAsync from '../../utils/catchAsync.js';
import AppError from '../../utils/appError.js';

// POST /api/v1/wishlist/toggle/:propertyId
export const toggleWishlist = catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    const { propertyId } = req.params;

    const user = await User.findById(userId);
    if (!user) return next(new AppError('Không tìm thấy người dùng', 404));

    const idx = user.wishlist.findIndex(id => id.toString() === propertyId);
    let saved;
    if (idx === -1) {
        user.wishlist.push(propertyId);
        saved = true;
    } else {
        user.wishlist.splice(idx, 1);
        saved = false;
    }
    await user.save();

    res.status(200).json({
        status: 'success',
        data: { saved, wishlist: user.wishlist }
    });
});

// GET /api/v1/wishlist
export const getWishlist = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id)
        .populate({
            path: 'wishlist',
            populate: [
                { path: 'category', select: 'name icon' },
                { path: 'location.district', select: 'name city' },
                { path: 'amenities', select: 'name icon' }
            ]
        });

    if (!user) return next(new AppError('Không tìm thấy người dùng', 404));

    res.status(200).json({
        status: 'success',
        data: { wishlist: user.wishlist || [] }
    });
});

// GET /api/v1/wishlist/check/:propertyId
export const checkWishlist = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id).select('wishlist');
    if (!user) return next(new AppError('Không tìm thấy người dùng', 404));
    const isSaved = user.wishlist.some(id => id.toString() === req.params.propertyId);
    res.status(200).json({ status: 'success', data: { isSaved } });
});
