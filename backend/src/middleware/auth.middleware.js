import jwt from 'jsonwebtoken';
import AppError from '../utils/appError';

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
        const decodedPayload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        // Gán thông tin user đã giải mã vào req
        req.user = decodedPayload;

        // Cho phép req đi tiếp vào controller hoặc middlware tiếp theo
        next();

    }catch(error){
        // Xử lý các lỗi phát sinh (ví dụ: Token hết hạn, Token sai...)
        return next(new AppError("Mã xác thực không hợp lệ hoặc đã hết hạn.", 401));
    }
}