import { useEffect, useRef, useState } from 'react';
import { Send, MessageCircle, ArrowLeft, User as UserIcon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useChatStore } from '@/store/useChatStore';
import { useAuthStore } from '@/store/useAuthStore';
import Navbar from '../shared/Navbar';

const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return 'Hôm nay';
    return d.toLocaleDateString('vi-VN');
};

function Avatar({ user, size = 8 }) {
    if (user?.avatarUrl) return <img src={user.avatarUrl} alt="" className={`w-${size} h-${size} rounded-full object-cover`} />;
    return (
        <div className={`w-${size} h-${size} rounded-full bg-[#1565C0] flex items-center justify-center text-white font-bold text-sm`}>
            {user?.displayName?.[0]?.toUpperCase() || '?'}
        </div>
    );
}

export default function ChatPage() {
    const location = useLocation();
    const { user } = useAuthStore();
    const {
        conversations, currentConv, messages, loading, sendingMessage,
        fetchConversations, selectConversation, sendMessage
    } = useChatStore();

    const [input, setInput] = useState('');
    const [showList, setShowList] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchConversations();
    }, []);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const convId = params.get('conv');
        // Nếu có convId từ query param, fetch lại danh sách để đảm bảo conv mới đã có
        if (convId) {
            fetchConversations();
        }
    }, [location.search]);

    // Handle query param ?conv=... sau khi conversations đã load
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const convId = params.get('conv');
        if (convId && conversations.length > 0) {
            const conv = conversations.find(c => c._id === convId);
            if (conv) handleSelectConv(conv);
        }
    }, [conversations, location.search]);

    // Join socket room
    useEffect(() => {
        if (currentConv && window._socket) {
            window._socket.emit('join_conversation', currentConv._id);
        }
        return () => {
            if (currentConv && window._socket) {
                window._socket?.emit('leave_conversation', currentConv._id);
            }
        };
    }, [currentConv?._id]);

    const handleSelectConv = async (conv) => {
        await selectConversation(conv);
        setShowList(false);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        await sendMessage(input);
        setInput('');
    };

    const getOtherUser = (conv) => {
        return conv.participants?.find(p => p._id !== user?._id) || conv.participants?.[0];
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex h-[calc(100vh-140px)]">

                    {/* Sidebar — danh sách conversations */}
                    <div className={`w-full md:w-80 border-r border-gray-100 flex flex-col ${!showList ? 'hidden md:flex' : 'flex'}`}>
                        <div className="px-4 py-4 border-b border-gray-100">
                            <h2 className="font-bold text-gray-900 text-base flex items-center gap-2">
                                <MessageCircle className="w-5 h-5 text-[#1565C0]" /> Tin nhắn
                            </h2>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {conversations.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center px-6 py-10 text-gray-400">
                                    <MessageCircle className="w-12 h-12 mb-3 opacity-30" />
                                    <p className="text-sm">Chưa có cuộc trò chuyện nào</p>
                                </div>
                            ) : conversations.map(conv => {
                                const other = getOtherUser(conv);
                                const isActive = currentConv?._id === conv._id;
                                return (
                                    <button
                                        key={conv._id}
                                        onClick={() => handleSelectConv(conv)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-gray-50 hover:bg-gray-50 transition-colors ${isActive ? 'bg-blue-50' : ''}`}
                                    >
                                        <Avatar user={other} />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 text-sm truncate">{other?.displayName}</p>
                                            <p className="text-xs text-gray-400 truncate">
                                                {conv.lastMessage?.content || 'Bắt đầu trò chuyện...'}
                                            </p>
                                        </div>
                                        <span className="text-[10px] text-gray-400 shrink-0">
                                            {formatTime(conv.lastMessageAt)}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Chat area */}
                    <div className={`flex-1 flex flex-col ${showList && !currentConv ? 'hidden md:flex' : 'flex'}`}>
                        {!currentConv ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                                <MessageCircle className="w-16 h-16 opacity-20 mb-4" />
                                <p className="text-sm">Chọn một cuộc trò chuyện để bắt đầu</p>
                            </div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                                    <button className="md:hidden p-1 text-gray-500" onClick={() => setShowList(true)}>
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    <Avatar user={getOtherUser(currentConv)} />
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">{getOtherUser(currentConv)?.displayName}</p>
                                        {currentConv.property && (
                                            <p className="text-[10px] text-gray-400 truncate max-w-[200px]">
                                                về: {currentConv.property.title}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
                                    {loading ? (
                                        <div className="flex-1 flex items-center justify-center">
                                            <div className="w-6 h-6 border-2 border-[#1565C0] border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    ) : messages.map((msg, idx) => {
                                        const isMine = msg.sender?._id === user?._id || msg.sender === user?._id;
                                        const showDate = idx === 0 || formatDate(messages[idx - 1]?.createdAt) !== formatDate(msg.createdAt);
                                        return (
                                            <div key={msg._id || idx}>
                                                {showDate && (
                                                    <div className="text-center text-[10px] text-gray-400 my-3">
                                                        {formatDate(msg.createdAt)}
                                                    </div>
                                                )}
                                                <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                                                    {!isMine && <Avatar user={msg.sender} size={6} />}
                                                    <div className={`max-w-[65%] px-3 py-2 rounded-2xl text-sm ${isMine ? 'bg-[#1565C0] text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'}`}>
                                                        <p>{msg.content}</p>
                                                        <p className={`text-[10px] mt-1 ${isMine ? 'text-blue-200' : 'text-gray-400'} text-right`}>
                                                            {formatTime(msg.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                <form onSubmit={handleSend} className="px-4 py-3 border-t border-gray-100 flex items-center gap-2">
                                    <input
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        placeholder="Nhập tin nhắn..."
                                        className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0]/20"
                                    />
                                    <button
                                        type="submit"
                                        disabled={sendingMessage || !input.trim()}
                                        className="w-10 h-10 bg-[#1565C0] rounded-xl flex items-center justify-center text-white disabled:opacity-50 shrink-0"
                                    >
                                        {sendingMessage
                                            ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            : <Send className="w-4 h-4" />
                                        }
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
