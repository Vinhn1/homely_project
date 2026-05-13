import axiosInstance from './axiosInstance';

export const chatApi = {
    getConversations: () => axiosInstance.get('/chat/conversations'),
    createOrGet: (data) => axiosInstance.post('/chat/conversations', data),
    getMessages: (convId, page = 1) => axiosInstance.get(`/chat/conversations/${convId}/messages?page=${page}`),
    sendMessage: (convId, content) => axiosInstance.post(`/chat/conversations/${convId}/messages`, { content }),
    getUnreadCount: () => axiosInstance.get('/chat/unread-count'),
};
