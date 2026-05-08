import { create } from 'zustand';
import axios from 'axios';

export const useAuthStore = create((set) => ({

    // ================================
    // STATE
    // ================================

    // JWT access token hiện tại
    accessToken: null,

    // Thông tin user đang đăng nhập
    user: null,

    // Trạng thái đăng nhập
    isAuthenticated: false,

    // Trạng thái kiểm tra auth khi app khởi động
    isCheckingAuth: true,


    // ================================
    // ACTIONS
    // ================================

    // Cập nhật auth state sau login thành công
    setAuth: ({ accessToken, user }) =>
        set({
            accessToken,
            user,
            isAuthenticated: true
        }),


    // Xóa toàn bộ auth state khi logout
    clearAuth: () =>
        set({
            accessToken: null,
            user: null,
            isAuthenticated: false
        }),


    // Kiểm tra người dùng còn đăng nhập hay không
    // Chạy khi app khởi động
    checkAuth: async () => {

        try {

            // Gọi API kiểm tra phiên đăng nhập
            // Backend sẽ đọc refreshToken từ HttpOnly Cookie
            const response = await axios.get('http://localhost:5000/api/v1/auth/me', { withCredentials: true });

            // Lấy dữ liệu trả về từ backend
            const { accessToken, user } = response.data.data;

            // Cập nhật auth state
            set({
                accessToken,
                user,
                isAuthenticated: true
            });

        } catch (error) {

            // Nếu token không hợp lệ hoặc hết hạn
            // Reset auth state
            set({
                accessToken: null,
                user: null,
                isAuthenticated: false
            });

        } finally {

            // Dù thành công hay thất bại
            // đều kết thúc trạng thái checking auth
            set({
                isCheckingAuth: false
            });
        }
    },

    // LOGIN
    login: async (data) => {
        try {

            const response = await axios.post(
                'http://localhost:5000/api/v1/auth/login',
                data,
                { withCredentials: true }
            );

            const { accessToken, user } = response.data.data;

            // Gọi lại action setAuth
            get().setAuth({ accessToken, user });

            return response.data;

        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // SIGNUP
    signup: async (data) => {
        try {

            const response = await axios.post(
                'http://localhost:5000/api/v1/auth/register',
                data,
                { withCredentials: true }
            );

            const { accessToken, user } = response.data.data;

            // Reuse action
            get().setAuth({ accessToken, user });
            
            return response.data;

        } catch (error) {

            throw error.response?.data || error;
        }
    },

    // LOGOUT
    logout: async () => {
        try {

            // Gọi API Logout để backend xóa cookie (refresh token)
            await axios.post('http://localhost:5000/api/v1/auth/logout', {}, { withCredentials: true });

            // Xóa thông tin phía client (Store)
            set({
                accessToken: null,
                user: null,
                isAuthenticated: false
            })

        } catch (error) {
            console.error("Lỗi đăng xuất: ", error.response?.data?.message || error.message);
        }
    }
}))