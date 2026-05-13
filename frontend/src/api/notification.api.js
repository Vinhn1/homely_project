import axiosInstance from './axiosInstance';

export const notificationApi = {
    getAll: (page = 1) => axiosInstance.get(`/notifications?page=${page}`),
    markRead: (id) => axiosInstance.patch(`/notifications/${id}/read`),
    markAllRead: () => axiosInstance.patch('/notifications/read-all'),
    remove: (id) => axiosInstance.delete(`/notifications/${id}`)
};

export const adminApi = {
    getStats: () => axiosInstance.get('/admin/stats'),
    getProperties: (params) => axiosInstance.get('/admin/properties', { params }),
    updatePropertyStatus: (id, data) => axiosInstance.patch(`/admin/properties/${id}/status`, data),
    getUsers: (params) => axiosInstance.get('/admin/users', { params }),
    banUser: (id, data) => axiosInstance.patch(`/admin/users/${id}/ban`, data),
    updateUserRole: (id, data) => axiosInstance.patch(`/admin/users/${id}/role`, data),
    getReports: (params) => axiosInstance.get('/admin/reports', { params }),
    resolveReport: (id, data) => axiosInstance.patch(`/admin/reports/${id}`, data),
};

export const reportApi = {
    create: (data) => axiosInstance.post('/reports', data),
};
