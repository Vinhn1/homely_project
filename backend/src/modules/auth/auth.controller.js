/**
 * @file auth.controller.js
 * @description Tiếp nhận yêu cầu HTTP và điều phối logic xác thực.
 */

import * as authService from './auth.service.js';
import catchAsync from '../../utils/catchAsync.js';
import ApiResponse from '../../utils/apiResponse.js';

// REGISTER
export const register = catchAsync(async (req, res, next) => {
    // 1. Lấy dữ liệu từ req.body
    const { username, email, password, displayName } = req.body;
    
    // 2. Gọi Service để thực hiện đăng ký
    const newUser = await authService.register({
        username,
        email,
        password,
        displayName
    });

    // 3. Trả về res thành công bằng ApiResponse
    ApiResponse.success(res, "Đăng ký thành công!", newUser, 201); 
})