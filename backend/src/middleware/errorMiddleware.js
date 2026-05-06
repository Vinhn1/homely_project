// Xử lý toàn bộ lỗi tập trung cho ứng dụng Express

import ApiResponse from "../utils/apiResponse.js";

const errorMiddleware = (err, req, res, next) => {

    // Nếu lỗi không có status code thì mặc định là 500
    err.statusCode = err.statusCode || 500;

    // Nếu lỗi không có status thì mặc định là error
    err.status = err.status || "error";

    // DEVELOPMENT MODE (Hiển thị toàn bộ lỗi để debug)
    if(process.env.NODE_ENV === 'development'){

        console.error("DEV ERROR: ", err);

        return ApiResponse.errors(
            res, 
            err.message,
            err.statusCode,
            {
                stack: err.stack
            }
        )

    }else{
        // PRODUCTION MODE (Lỗi do mình chủ động xử lý)
        if(err.isOperational){

            return ApiResponse.errors(
                res,
                err.message,
                err.statusCode
            )
        }

        // Lỗi hệ thống không xác định
        console.error('PRODUCTION ERROR: ', err);

        return ApiResponse.errors(
            res,
            'Something went very wrong!',
            500
        )
    }
};

export default errorMiddleware;

