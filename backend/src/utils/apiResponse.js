// Lớp dùng để chuẩn hóa response trả về cho client
// Giúp tất cả API có cùng cấu trúc response

class ApiResponse {

    constructor(statusCode, message, data = null, meta = null, errors = null) {

        // HTTP status code
        this.statusCode = statusCode
        // Nội dung phản hồi
        this.message = message
        // Dữ liệu trả về
        this.data = data;
        // Thông tin phân trang nếu có
        this.meta = meta;
        // Chi tiết lỗi validate hoặc lỗi khác
        this.errors = errors;

        // Thành công nếu statusCode nằm trong khoảng 2xx
        this.success = statusCode >= 200 && statusCode < 300;
    }

    // Response thành công
    static success(res, message, data = null, statusCode = 200, meta = null) {

        return res.status(statusCode).json(
            new ApiResponse(
                statusCode,
                message,
                data,
                meta
            )
        );
    }

    // Response Lỗi
    static errors(res, message, statusCode = 500, errors = null) {

        return res.status(statusCode).json(
            new ApiResponse(
                statusCode,
                message,
                null,
                null,
                errors
            )
        );
    }
}

export default ApiResponse;