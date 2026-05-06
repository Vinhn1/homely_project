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


// LOGIN
export const login = catchAsync(async (req, res, next) => {

    // Lấy email và pass từ req.body
    const { email, password } = req.body;

    // Gọi service xử lý login
    const result = await authService.login(
        email,
        password
    );

    // Lưu refresh token vào cookie
    res.cookie('refreshToken', result.refreshToken, {

        // Cookie chỉ truy cập được từ server
        httpOnly: true,

        // Chỉ gửi cookie qua HTTPS ở production
        secure: process.env.NODE_ENV === 'production',

        // Chống CSRF cơ bản
        sameSite: 'Strict',

        // Thời gian sống cookie (7 ngày)
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // trả res thành công 
    return ApiResponse.success(
        res,
        'Đăng nhập thành công',
        {
            user: result.user,
            accessToken: result.accessToken
        },
        200
    );

});

