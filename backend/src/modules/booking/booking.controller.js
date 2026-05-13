import catchAsync from '../../utils/catchAsync.js';
import ApiResponse from '../../utils/apiResponse.js';
import * as bookingService from './booking.service.js';

export const createBooking = catchAsync(async (req, res) => {
    const bookingData = {
        ...req.body,
        user: req.user.id
    };

    const booking = await bookingService.createBooking(bookingData);

    return ApiResponse.success(res, 'Gửi yêu cầu đặt phòng thành công', { booking }, 201);
});

export const getMyBookings = catchAsync(async (req, res) => {
    const bookings = await bookingService.getMyBookings(req.user.id);

    return ApiResponse.success(res, 'Lấy danh sách đặt phòng của bạn thành công', { bookings }, 200);
});

export const updateBookingStatus = catchAsync(async (req, res) => {
    const { status } = req.body;
    const booking = await bookingService.updateBookingStatus(req.params.id, status, req.user.id);

    return ApiResponse.success(res, `Đã cập nhật trạng thái thành ${status}`, { booking }, 200);
});

export const getOwnerBookings = catchAsync(async (req, res) => {
    const bookings = await bookingService.getOwnerBookings(req.user.id);

    return ApiResponse.success(res, 'Lấy danh sách yêu cầu thuê phòng thành công', { bookings }, 200);
});
