/**
 * @file auth.service.js
 * @description Xử lý logic nghiệp vụ liên quan đến xác thực (Đăng ký, Đăng nhập, Tokens).
 */
import User from './user.model.js';
import AppError from '../../utils/appError.js';


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