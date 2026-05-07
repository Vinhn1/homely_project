import jwt from 'jsonwebtoken';

// Hàm tạo Access Token và Refresh Token cho user
export const generateTokens = (userId) => {

    // Tạo access token, Token này dùng để xác thực API, thời gian sống ngắn
    const accessToken = jwt.sign(
        
        // Payload lưu thông tin bên trong token
        {id: userId},

        // Secret key dùng để mã hóa token
        process.env.ACCESS_TOKEN_SECRET,

        // Cấu hình thời gian hết hạn
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
        }
    );

    // Tạo refresh token, dùng để cấp lại Access Token khi hết hạn, sống lâu hơn access token
    const refreshToken = jwt.sign(

        // Payload
        {id: userId},

        // Secret 
        process.env.REFRESH_TOKEN_SECRET,

        // Thời gian hết hạn
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
        }
    );

    // Trả về cả 2 token
    return {
        accessToken,
        refreshToken
    };
};
