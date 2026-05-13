import Booking from './booking.model.js';
import AppError from '../../utils/appError.js';

export const createBooking = async (bookingData) => {
    return await Booking.create(bookingData);
};

export const getMyBookings = async (userId) => {
    return await Booking.find({ user: userId })
        .populate({
            path: 'property',
            select: 'title images price location',
            populate: { path: 'location.district', select: 'name' }
        })
        .sort('-createdAt');
};

export const updateBookingStatus = async (bookingId, status, ownerId) => {
    const booking = await Booking.findById(bookingId).populate('property');

    if (!booking) {
        throw new AppError('Không tìm thấy yêu cầu đặt phòng', 404);
    }

    // Chỉ chủ nhà mới được duyệt booking
    if (booking.property.owner.toString() !== ownerId.toString()) {
        throw new AppError('Bạn không có quyền thực hiện hành động này', 403);
    }

    booking.status = status;
    await booking.save();

    return booking;
};

export const getOwnerBookings = async (ownerId) => {
    // Lấy tất cả bookings cho các properties của owner này
    return await Booking.find()
        .populate({
            path: 'property',
            match: { owner: ownerId }
        })
        .populate('user', 'displayName email phone')
        .then(bookings => bookings.filter(b => b.property != null))
        .then(bookings => bookings.sort((a, b) => b.createdAt - a.createdAt));
};
