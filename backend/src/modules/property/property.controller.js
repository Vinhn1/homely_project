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

    // Tái cấu trúc dữ liệu từ flat sang nested location
    const { address, district, city, ...rest } = req.body;
    
    const propertyData = {
        ...rest,
        location: {
            address,
            district,
            city: city || 'Vĩnh Long' // Ưu tiên body, nếu không có lấy Vĩnh Long
        },
        images: imageUrls
    };

    const property = await propertyService.createProperty(
        propertyData,
        req.user.id
    );

    return ApiResponse.success(res, 'Đăng tin thành công, vui lòng chờ admin duyệt', { property }, 201);
});


// GET /api/v1/properties
export const getAllProperties = catchAsync(async (req, res) => {

    const result = await propertyService.getAllProperties(req.query);

    return ApiResponse.success(res, 'Lấy danh sách thành công', result, 200);
});


// GET /api/v1/properties/:id
export const getPropertyById = catchAsync(async (req, res) => {

    const property = await propertyService.getPropertyById(req.params.id, req.user);

    return ApiResponse.success(res, 'Lấy chi tiết thành công', { property }, 200);
});


// PATCH /api/v1/properties/:id
export const updateProperty = catchAsync(async (req, res) => {
    // Nếu có upload ảnh mới, lấy URL
    const newImageUrls = req.files ? req.files.map(file => file.path) : [];
    
    // Tái cấu trúc dữ liệu cho update
    const { address, district, city, existingImages, ...rest } = req.body;
    
    const updateData = { ...rest };
    
    // Xử lý location bằng dot notation để tránh ghi đè toàn bộ object và lỗi validation
    if (address) updateData['location.address'] = address;
    if (district) updateData['location.district'] = district;
    if (city) updateData['location.city'] = city;

    // Xử lý logic ảnh: trộn ảnh cũ còn giữ lại và ảnh mới upload
    let finalImages = [];
    
    // Parse existingImages nếu nó là string (khi gửi qua FormData)
    if (existingImages) {
        try {
            const parsedExisting = typeof existingImages === 'string' 
                ? JSON.parse(existingImages) 
                : existingImages;
            finalImages = Array.isArray(parsedExisting) ? parsedExisting : [parsedExisting];
        } catch (error) {
            finalImages = [];
        }
    }

    // Thêm ảnh mới vào mảng
    finalImages = [...finalImages, ...newImageUrls];
    updateData.images = finalImages;

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
