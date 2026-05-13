import jwt from 'jsonwebtoken';
import User from '../modules/auth/user.model.js';
import AppError from '../utils/appError.js';

/**
 * Middleware bảo vệ các route yêu cầu đăng nhập
 */

export const protect = async (req, res, next) => {
    try{

        let token;

        // Kiểm tra header authorization có tồn tại và bắt đầu bằng "Beare" không 
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            
            // Lấy token thực sự từ chuỗi "Bearer <Token>"
            token = req.headers.authorization.split(" ")[1];
        }

        // Nếu không tìm thấy token trả về lỗi 401 (Unauthorized)
        if(!token){
            return next(new AppError("Bạn chưa đăng nhập! Vui lòng đăng nhập để truy cập", 401));
        }

        // Giải mã và xác thực token 
        // jwt.verify sẽ trả về payload (dữ liệu chứa trong token) nếu thành công
        const decodedPayload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Tìm user trong database để đảm bảo user vẫn tồn tại
        const user = await User.findById(decodedPayload.id);
        if (!user) {
            return next(new AppError("Người dùng không còn tồn tại trên hệ thống.", 401));
        }

        if (user.isBanned) {
            return next(new AppError(user.banReason || 'Tài khoản của bạn đã bị khóa.', 403));
        }

        // Gán thông tin user vào req
        req.user = user;

        // Cho phép req đi tiếp vào controller hoặc middlware tiếp theo
        next();

    }catch(error){
        // Xử lý các lỗi phát sinh (ví dụ: Token hết hạn, Token sai...)
        return next(new AppError("Mã xác thực không hợp lệ hoặc đã hết hạn.", 401));
    }
}

export const optionalProtect = async (req, res, next) => {
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
            return next();
        }

        const token = req.headers.authorization.split(" ")[1];
        if (!token) return next();

        const decodedPayload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedPayload.id);

        if (user && !user.isBanned) {
            req.user = user;
        }

        next();
    } catch {
        next();
    }
}

/**
 * Middleware phân quyền theo role
 */
export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('Bạn không có quyền thực hiện hành động này', 403));
        }
        next();
    };
}
