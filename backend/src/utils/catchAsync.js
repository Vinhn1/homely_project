// Hàm dùng để tự động bắt lỗi trong async function
// Giúp không cần viết try/catch ở mọi controller

const catchAsync = (fn) => {
    
    // Trả về middleware mới cho Express
    return (req, res, next) => {

        // Chạy async function
        // Nếu có lỗi => tự động next(error)
        fn(req, res, next).catch(next);
    }
}

export default catchAsync;