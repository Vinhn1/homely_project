/**
 * @file auth.service.js
 * @description Xử lý logic nghiệp vụ liên quan đến xác thực (Đăng ký, Đăng nhập, Tokens).
 */
import User from './user.model.js';
import AppError from '../../utils/appError.js';
import { generateTokens } from '../../utils/tokenUtils.js';


// REGISTER
export const register = async (userData) => {
    // 1. Tìm user theo email hoặc username
    const existingUser = await User.findOne({
        $or: [
            {
                email: userData.email
            },{
                username: userData.username
            }
        ]
    });

    // 2. Nếu có -> throw new AppError()
    if(existingUser){
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
    if(!email || !password){
        throw new AppError("Vui lòng nhập email hoặc mật khẩu", 400);
    }
    
    // Tìm user theo email
    // .select('+password') vì field password đang bị ẩn
    const existingUser = await User.findOne({email}).select('+password');

    // Nếu không tìm thấy 
    if(!existingUser){
        throw new AppError("Địa chỉ email hoặc mật khẩu không chính xác!", 401);
    }

    // So sánh password nhập với pass ở db
    const isPasswordCorrect = await existingUser.comparePassword(
        password, 
        existingUser.password
    );

    // Sai pass
    if(!isPasswordCorrect){
        throw new AppError("Địa chỉ email hoặc mật khẩu không chính xác", 401);
    }

    // Tạo access token và refresh token
    const tokens = generateTokens(existingUser._id);

    // Ẩn pass trước khi trả về client
    existingUser.password = undefined;

    // Trả về dữ liệu sau login
    return {
        user: existingUser,
        ...tokens
    };
};