import { create } from 'zustand';
import { chatApi } from '../api/chat.api';
import { toast } from 'sonner';
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set, get) => ({
    conversations: [],
    currentConv: null,
    messages: [],
    unreadCount: 0,
    loading: false,
    sendingMessage: false,

    fetchConversations: async () => {
        try {
            const res = await chatApi.getConversations();
            set({ conversations: res.data.data.conversations });
        } catch {}
    },

    fetchUnreadCount: async () => {
        try {
            const res = await chatApi.getUnreadCount();
            set({ unreadCount: res.data.data.unreadCount });
        } catch {}
    },

    openConversation: async (recipientId, propertyId) => {
        set({ loading: true });
        try {
            const res = await chatApi.createOrGet({ recipientId, propertyId });
            const conv = res.data.data.conversation;
            set({ currentConv: conv, loading: false });
            await get().fetchMessages(conv._id);
            return conv;
        } catch {
            set({ loading: false });
            toast.error('Không thể mở cuộc trò chuyện');
        }
    },

    selectConversation: async (conv) => {
        set({ currentConv: conv, messages: [] });
        await get().fetchMessages(conv._id);
    },

    fetchMessages: async (convId) => {
        set({ loading: true });
        try {
            const res = await chatApi.getMessages(convId);
            set({ messages: res.data.data.messages, loading: false });
        } catch {
            set({ loading: false });
        }
    },

    sendMessage: async (content) => {
        const { currentConv } = get();
        if (!currentConv || !content.trim()) return;
        set({ sendingMessage: true });
        try {
            const res = await chatApi.sendMessage(currentConv._id, content);
            const msg = res.data.data.message;
            
            set(state => {
                // Kiểm tra xem tin nhắn đã được thêm bởi socket trước đó chưa
                const msgId = msg._id?.toString();
                const exists = state.messages.some(m => m._id?.toString() === msgId);
                
                const nextMessages = exists ? state.messages : [...state.messages, msg];
                
                return {
                    messages: nextMessages,
                    sendingMessage: false,
                    conversations: state.conversations.map(c =>
                        c._id === currentConv._id
                            ? { ...c, lastMessage: msg, lastMessageAt: msg.createdAt }
                            : c
                    )
                };
            });
            return msg;
        } catch (error) {
            set({ sendingMessage: false });
            toast.error('Gửi tin nhắn thất bại');
            throw error;
        }
    },

    addSocketMessage: (message) => {
        if (!message || !message._id) return;
        
        set(state => {
            const messageId = message._id.toString();
            const convId = message.conversation?.toString() || message.conversation?._id?.toString();
            
            // 1. Kiểm tra duplicate
            const exists = state.messages.some(m => m._id?.toString() === messageId);
            
            let nextMessages = state.messages;
            if (!exists && state.currentConv && state.currentConv._id === convId) {
                nextMessages = [...state.messages, message];
            }

            // 2. Cập nhật conversations list
            const nextConversations = state.conversations.map(c =>
                c._id === convId
                    ? { ...c, lastMessage: message, lastMessageAt: message.createdAt }
                    : c
            );

            // 3. Xử lý unreadCount
            let nextUnreadCount = state.unreadCount;
            const currentUser = useAuthStore.getState().user;
            const senderId = message.sender?._id || message.sender;
            
            if (currentUser && senderId?.toString() !== currentUser._id?.toString()) {
                if (!state.currentConv || state.currentConv._id !== convId) {
                    nextUnreadCount += 1;
                }
            }

            return {
                messages: nextMessages,
                conversations: nextConversations,
                unreadCount: nextUnreadCount
            };
        });
    },

    incrementUnread: () => set(state => ({ unreadCount: state.unreadCount + 1 })),
}));
