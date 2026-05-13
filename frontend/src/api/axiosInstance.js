import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

const axiosInstance = axios.create({
    baseURL:
        import.meta.env.VITE_API_URL ||
        'http://localhost:5000/api/v1',

    timeout: 10000,

    // Cho phép browser gửi cookie
    withCredentials: true
});


// ================================
// REQUEST INTERCEPTOR
// ================================

axiosInstance.interceptors.request.use(
    (config) => {

        // Lấy access token từ Zustand store
        const token = useAuthStore.getState().accessToken;

        if (token) {
            config.headers = config.headers || {};

            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    (error) => Promise.reject(error)
);


// ================================
// RESPONSE INTERCEPTOR
// ================================

axiosInstance.interceptors.response.use(

    // Request thành công
    (response) => response,

    // Request thất bại
    async (error) => {

        const originalRequest = error.config;

        // Nếu access token hết hạn
        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {

            originalRequest._retry = true;

            try {

                // Gọi API refresh token
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/auth/refresh-token`,
                    {},
                    {
                        withCredentials: true
                    }
                );

                const newAccessToken = response.data.data.accessToken;

                // Cập nhật token mới vào store
                useAuthStore.getState().setAuth({
                    accessToken: newAccessToken,
                    user: response.data.data.user
                });

                // Gắn token mới vào request cũ
                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                // Gửi lại request cũ
                return axiosInstance(originalRequest);

            } catch (refreshError) {

                // Refresh token hết hạn -> logout
                useAuthStore.getState().clearAuth();

                // Redirect login
                window.location.href = '/login';

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;