/**
 * @file property.controller.js
 * @description Controller xử lý request/response cho Property module
 */
import catchAsync from '../../utils/catchAsync.js';
import ApiResponse from '../../utils/apiResponse.js';
import * as propertyService from './property.service.js';


// POST /api/v1/properties
export const createProperty = catchAsync(async (req, res) => {

    // Lấy URL ảnh từ Cloudinary (sau khi multer đã upload)
    const imageUrls = req.files ? req.files.map(file => file.path) : [];

    const property = await propertyService.createProperty(
        { ...req.body, images: imageUrls },
        req.user.id
    );

    return ApiResponse.success(res, 'Đăng tin thành công', { property }, 201);
});


// GET /api/v1/properties
export const getAllProperties = catchAsync(async (req, res) => {

    const result = await propertyService.getAllProperties(req.query);

    return ApiResponse.success(res, 'Lấy danh sách thành công', result, 200);
});


// GET /api/v1/properties/:id
export const getPropertyById = catchAsync(async (req, res) => {

    const property = await propertyService.getPropertyById(req.params.id);

    return ApiResponse.success(res, 'Lấy chi tiết thành công', { property }, 200);
});


// PATCH /api/v1/properties/:id
export const updateProperty = catchAsync(async (req, res) => {

    // Nếu có upload ảnh mới, lấy URL và thêm vào
    const newImageUrls = req.files ? req.files.map(file => file.path) : [];
    const updateData = { ...req.body };
    if (newImageUrls.length > 0) {
        updateData.images = newImageUrls;
    }

    const property = await propertyService.updateProperty(
        req.params.id,
        updateData,
        req.user.id
    );

    return ApiResponse.success(res, 'Cập nhật thành công', { property }, 200);
});


// DELETE /api/v1/properties/:id
export const deleteProperty = catchAsync(async (req, res) => {

    const result = await propertyService.deleteProperty(req.params.id, req.user.id);

    return ApiResponse.success(res, result.message, null, 200);
});


// GET /api/v1/properties/my-listings
export const getMyProperties = catchAsync(async (req, res) => {

    const result = await propertyService.getMyProperties(req.user.id, req.query);

    return ApiResponse.success(res, 'Lấy danh sách bài đăng của bạn thành công', result, 200);
});
