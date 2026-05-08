import * as amenityService from './amenity.service.js';
import catchAsync from '../../utils/catchAsync.js';
import ApiResponse from '../../utils/apiResponse.js';

export const getAllAmenities = catchAsync(async (req, res) => {
    const amenities = await amenityService.getAllAmenities();
    return ApiResponse.success(res, 'Lấy danh sách tiện ích thành công', { amenities });
});

export const createAmenity = catchAsync(async (req, res) => {
    const amenity = await amenityService.createAmenity(req.body);
    return ApiResponse.success(res, 'Tạo tiện ích thành công', { amenity }, 201);
});
