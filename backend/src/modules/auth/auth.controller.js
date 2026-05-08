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
    const { username, email, password, displayName, role, phone } = req.body;
    
    // 2. Gọi Service để thực hiện đăng ký
    const newUser = await authService.register({
        username,
        email,
        password,
        displayName,
        role,
        phone
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


// LOGOUT
export const logout = catchAsync(async (req, res, next) => {
    // Lấy refreshToken từ cookie
    const { refreshToken } = req.cookies;

    // Truyền cả userId và refreshToken vào service
    const result = await authService.logout(req.user.id, refreshToken);

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict'
    });

    res.status(200).json({ status: 'success', ...result });
});


// GETME
export const getMe = catchAsync(async (req, res, next) => {
    
    // Lấy id người dùng từ req.user (được thiết lập từ middleware để bảo vệ)
    const userId = req.user.id;

    // Gọi logic xử lý tầng Service
    const user = await authService.getMe(userId);

    // Trả về phản hồi thành công cho frontend
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});


// REFRESH TOKEN
// Frontend gọi endpoint này khi app khởi động để lấy lại accessToken từ refreshToken cookie
export const refreshToken = catchAsync(async (req, res, next) => {

    // Đọc refreshToken từ httpOnly cookie (an toàn, JS không đọc được)
    const { refreshToken } = req.cookies;

    // Gọi service xử lý logic
    const result = await authService.refreshToken(refreshToken);

    // Trả về accessToken mới và thông tin user
    return ApiResponse.success(res, 'Làm mới token thành công', {
        accessToken: result.accessToken,
        user: result.user
    }, 200);
});

