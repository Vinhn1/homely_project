import * as districtService from './district.service.js';
import catchAsync from '../../utils/catchAsync.js';
import ApiResponse from '../../utils/apiResponse.js';

export const getAllDistricts = catchAsync(async (req, res) => {
    const { city } = req.query;
    const districts = await districtService.getAllDistricts(city);
    return ApiResponse.success(res, 'Lấy danh sách quận/huyện thành công', { districts });
});

export const createDistrict = catchAsync(async (req, res) => {
    const district = await districtService.createDistrict(req.body);
    return ApiResponse.success(res, 'Tạo quận/huyện thành công', { district }, 201);
});
