/**
 * SocketProvider.jsx
 * Kết nối Socket.io khi user đã đăng nhập và dispatch sự kiện vào các stores.
 */
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore } from '@/store/useAuthStore';
import { useChatStore } from '@/store/useChatStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useWishlistStore } from '@/store/useWishlistStore';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';

export default function SocketProvider({ children }) {
    const { isAuthenticated, user } = useAuthStore();
    const { addSocketMessage, incrementUnread, fetchUnreadCount } = useChatStore();
    const { addSocketNotification, fetchNotifications } = useNotificationStore();
    const { fetchWishlist } = useWishlistStore();
    const socketRef = useRef(null);

    useEffect(() => {
        if (!isAuthenticated || !user) {
            // Ngắt kết nối khi logout
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            return;
        }

        // Tạo kết nối socket
        const socket = io(SOCKET_URL, {
            query: { userId: user._id },
            transports: ['polling', 'websocket'], // Ưu tiên polling trước để tránh lỗi handshake
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
        });

        socket.on('new_message', (message) => {
            addSocketMessage(message);
        });

        socket.on('notification', () => {
            fetchNotifications();
        });

        // Load initial data
        fetchUnreadCount();
        fetchNotifications();
        fetchWishlist();

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [isAuthenticated, user?._id]);

    // Expose socket to window for join_conversation calls
    useEffect(() => {
        window._socket = socketRef.current;
    });

    return children;
}
