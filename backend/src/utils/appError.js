class AppError extends Error {
    constructor(message, statusCode) {
        // Gọi constructor của class Error
        super(message);

        // Gắn status code 
        this.statusCode = statusCode;

        // Tên của lỗi 
        this.name = this.constructor.name;

        // Giữ stack trace để dễ debug lỗi
        Error.captureStackTrace(this, this.constructor)

        // Nếu statusCode bắt đầu bằng 4 => lỗi phía client, ngược lại là server
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

        // Đánh dấu đây là lỗi mình chủ động xử lý
        this.isOperational = true;
    }
    
}

export default AppError;