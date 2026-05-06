// Xử lý toàn bộ lỗi tập trung cho ứng dụng Express

const errorMiddleware = (err, req, res, next) => {

    // Nếu lỗi không có status code thì mặc định là 500
    err.statusCode = err.statusCode || 500;

    // Nếu lỗi không có status thì mặc định là error
    err.status = err.status || "error";

    // DEVELOPMENT MODE (Hiển thị toàn bộ lỗi để debug)
    if(process.env.NODE_ENV === 'development'){

        console.error("DEV ERROR: ", err);

        return res.status(err.statusCode).json({
            success: false,
            status: err.status,
            message: err.message,
            // Stack trace giúp biết lỗi xảy ra ở đâu
            stack: err.stack
        });
    }else{
        // PRODUCTION MODE (Lỗi do mình chủ động xử lý)
        if(err.isOperational){

            return res.status(err.statusCode).json({
                success: false,
                status: err.status,
                message: err.message
            });
        }

        // Lỗi hệ thống không xác định
        console.error('PRODUCTION ERROR: ', err);

        return res.status(500).json({
            success: false,
            status: 'error',
            message: 'Something went very wrong!'
        });
    }
};

export default errorMiddleware;

