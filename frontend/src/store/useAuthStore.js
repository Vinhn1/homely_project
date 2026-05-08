import { create } from 'zustand';
import axios from 'axios';

export const useAuthStore = create((set, get) => ({

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

    // Lỗi đăng nhập (hiển thị trên UI)
    authError: null,


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
    // Chạy khi app khởi động / reload trang
    // Gọi /auth/refresh-token để dùng refreshToken cookie lấy lại accessToken mới
    checkAuth: async () => {

        try {

            // Gửi request — browser tự đính kèm refreshToken cookie nhờ withCredentials
            const response = await axios.post(
                'http://localhost:5000/api/v1/auth/refresh-token',
                {},
                { withCredentials: true }
            );

            // Backend trả về { accessToken, user }
            const { accessToken, user } = response.data.data;

            // Khôi phục auth state đầy đủ
            set({
                accessToken,
                user,
                isAuthenticated: true
            });

        } catch (error) {

            // refreshToken hết hạn hoặc không có → user thực sự chưa đăng nhập
            set({
                accessToken: null,
                user: null,
                isAuthenticated: false
            });

        } finally {

            // Dù thành công hay thất bại đều kết thúc trạng thái checking
            set({ isCheckingAuth: false });
        }
    },


    // LOGIN
    login: async (data) => {
        // Xóa lỗi cũ trước khi thử đăng nhập
        set({ authError: null });
        try {

            const response = await axios.post(
                'http://localhost:5000/api/v1/auth/login',
                data,
                { withCredentials: true }
            );

            const { accessToken, user } = response.data.data;

            // Gọi lại action setAuth và xóa lỗi
            set({ accessToken, user, isAuthenticated: true, authError: null });

            return response.data;

        } catch (error) {
            // Lưu thông báo lỗi vào state để UI hiển thị
            const message = error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
            set({ authError: message });
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