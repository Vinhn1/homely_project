import { create } from 'zustand';
import { notificationApi } from '../api/notification.api';

export const useNotificationStore = create((set, get) => ({
    notifications: [],
    unreadCount: 0,
    loading: false,

    fetchNotifications: async () => {
        set({ loading: true });
        try {
            const res = await notificationApi.getAll();
            set({
                notifications: res.data.data.notifications,
                unreadCount: res.data.data.unreadCount,
                loading: false
            });
        } catch {
            set({ loading: false });
        }
    },

    markRead: async (id) => {
        try {
            await notificationApi.markRead(id);
            set(state => ({
                notifications: state.notifications.map(n => n._id === id ? { ...n, isRead: true } : n),
                unreadCount: Math.max(0, state.unreadCount - 1)
            }));
        } catch {}
    },

    markAllRead: async () => {
        try {
            await notificationApi.markAllRead();
            set(state => ({
                notifications: state.notifications.map(n => ({ ...n, isRead: true })),
                unreadCount: 0
            }));
        } catch {}
    },

    remove: async (id) => {
        try {
            await notificationApi.remove(id);
            const notif = get().notifications.find(n => n._id === id);
            set(state => ({
                notifications: state.notifications.filter(n => n._id !== id),
                unreadCount: notif && !notif.isRead ? Math.max(0, state.unreadCount - 1) : state.unreadCount
            }));
        } catch {}
    },

    addSocketNotification: (notif) => {
        set(state => ({
            notifications: [notif, ...state.notifications],
            unreadCount: state.unreadCount + 1
        }));
    }
}));
