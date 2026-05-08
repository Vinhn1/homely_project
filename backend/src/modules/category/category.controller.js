import * as categoryService from './category.service.js';
import catchAsync from '../../utils/catchAsync.js';
import ApiResponse from '../../utils/apiResponse.js';

export const getAllCategories = catchAsync(async (req, res) => {
    const categories = await categoryService.getAllCategories();
    return ApiResponse.success(res, 'Lấy danh sách danh mục thành công', { categories });
});

export const createCategory = catchAsync(async (req, res) => {
    const category = await categoryService.createCategory(req.body);
    return ApiResponse.success(res, 'Tạo danh mục thành công', { category }, 201);
});
