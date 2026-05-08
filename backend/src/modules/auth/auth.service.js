/**
 * @file auth.service.js
 * @description Xử lý logic nghiệp vụ liên quan đến xác thực (Đăng ký, Đăng nhập, Tokens).
 */
import User from './user.model.js';
import jwt from 'jsonwebtoken';
import AppError from '../../utils/appError.js';
import { generateTokens } from '../../utils/tokenUtils.js';


// REGISTER
export const register = async (userData) => {
    // 1. Tìm user theo email hoặc username
    const existingUser = await User.findOne({
        $or: [
            {
                email: userData.email
            }, {
                username: userData.username
            }
        ]
    });

    // 2. Nếu có -> throw new AppError()
    if (existingUser) {
        throw new AppError('Email hoặc tên đăng nhập đã tồn tại!', 400);
    }

    // 3. Nếu không -> User.create(userData)
    const newUser = await User.create(userData);

    // 4. Return user mới (thêm xử lý không lộ pass)
    //  Xóa password khỏi object trước khi trả về (bảo mật)
    newUser.password = undefined;
    return newUser;
}

// LOGIN
export const login = async (email, password) => {

    // Kiểm tra client có gửi email và pass không
    if (!email || !password) {
        throw new AppError("Vui lòng nhập email hoặc mật khẩu", 400);
    }

    // Tìm user theo email
    // .select('+password') vì field password đang bị ẩn
    const existingUser = await User.findOne({ email }).select('+password');

    // Nếu không tìm thấy 
    if (!existingUser) {
        throw new AppError("Địa chỉ email hoặc mật khẩu không chính xác!", 401);
    }

    // So sánh password nhập với pass ở db
    const isPasswordCorrect = await existingUser.comparePassword(
        password,
        existingUser.password
    );

    // Sai pass
    if (!isPasswordCorrect) {
        throw new AppError("Địa chỉ email hoặc mật khẩu không chính xác", 401);
    }

    // Tạo access token và refresh token
    const tokens = generateTokens(existingUser._id);



    // Lưu refresh token vào db 
    existingUser.refreshTokens.push(tokens.refreshToken);
    // Lưu lại (dùng validateBeforeSave để bỏ qua các validate khác nếu cần)
    await existingUser.save({
        validateBeforeSave: false
    })

    // Ẩn pass trước khi trả về client
    existingUser.password = undefined;

    // Trả về dữ liệu sau login
    return {
        user: existingUser,
        ...tokens
    };
};


// LOGOUT
export const logout = async (userId, refreshToken) => {
    const existingUser = await User.findById(userId);
    if (!existingUser) throw new AppError("User not found", 404);

    // Dùng filter để giữ lại toàn bộ token TRỪ cái đang dùng để logout
    existingUser.refreshTokens = existingUser.refreshTokens.filter(
        token => token !== refreshToken
    );

    await existingUser.save({ validateBeforeSave: false });
    return { message: "Đăng xuất thành công!" };
}


// GETME
export const getMe = async (userId) => {

    // Tìm kiếm người dùng trong db theo Id
    // Sử dụng .select() với dấu trừ (-) để loại trừ các trường không muốn lấy
    const user = await User.findById(userId).select("-password -refreshTokens");

    // Kiểm tra nếu không tìm thấy người dùng 
    if (!user) {
        throw new AppError("Người dùng không tồn tại", 404)
    }

    return user;
}

// REFRESH TOKEN
// Dùng để cấp lại accessToken mới khi app khởi động / reload trang
export const refreshToken = async (token) => {

    // Không có token trong cookie → chưa đăng nhập
    if (!token) {
        throw new AppError('Không tìm thấy refresh token', 401);
    }

    // Verify token bằng REFRESH_TOKEN_SECRET
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        throw new AppError('Refresh token không hợp lệ hoặc đã hết hạn', 401);
    }

    // Tìm user và kiểm tra token có trong danh sách không (chống token bị đánh cắp)
    const user = await User.findOne({
        _id: decoded.id,
        refreshTokens: token
    }).select('-password -refreshTokens');

    if (!user) {
        throw new AppError('Phiên đăng nhập không hợp lệ', 401);
    }

    // Tạo access token mới
    const { accessToken } = generateTokens(user._id);

    return { accessToken, user };
}
