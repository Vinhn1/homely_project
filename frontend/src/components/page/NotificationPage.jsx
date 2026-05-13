import { useEffect } from 'react';
import { Bell, Check, Trash2, Clock, Info, MessageSquare, Home, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useNotificationStore } from '@/store/useNotificationStore';
import Navbar from '../shared/Navbar';

const getIcon = (type) => {
    switch (type) {
        case 'new_message': return <MessageSquare className="w-4 h-4 text-blue-500" />;
        case 'booking_request':
        case 'booking_approved':
        case 'booking_rejected': return <Clock className="w-4 h-4 text-amber-500" />;
        case 'property_approved':
        case 'property_rejected': return <Home className="w-4 h-4 text-green-500" />;
        case 'system': return <Info className="w-4 h-4 text-gray-500" />;
        case 'report_resolved': return <ShieldAlert className="w-4 h-4 text-red-500" />;
        default: return <Bell className="w-4 h-4 text-gray-400" />;
    }
};

const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000); // seconds

    if (diff < 60) return 'Vừa xong';
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} ngày trước`;
    return d.toLocaleDateString('vi-VN');
};

export default function NotificationPage() {
    const { notifications, unreadCount, loading, fetchNotifications, markRead, markAllRead, remove } = useNotificationStore();

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Bell className="w-6 h-6 text-[#1565C0]" />
                            Thông báo
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Bạn có {unreadCount} thông báo mới chưa đọc
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            onClick={markAllRead}
                            className="text-xs text-[#1565C0] hover:bg-blue-50 h-8 gap-1"
                        >
                            <Check className="w-3.5 h-3.5" /> Đánh dấu đã đọc hết
                        </Button>
                    )}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading && notifications.length === 0 ? (
                        <div className="p-8 space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-20 bg-gray-50 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <Bell className="w-8 h-8 text-gray-200" />
                            </div>
                            <h2 className="text-gray-500 font-medium">Bạn chưa có thông báo nào</h2>
                            <p className="text-gray-400 text-xs mt-1">Các thông báo về phòng trọ và tin nhắn sẽ hiện ở đây</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {notifications.map((n) => (
                                <div
                                    key={n._id}
                                    className={`p-4 flex gap-4 transition-colors group ${!n.isRead ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
                                >
                                    <div className="shrink-0 mt-1">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${!n.isRead ? 'bg-white shadow-sm' : 'bg-gray-100'}`}>
                                            {getIcon(n.type)}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <Link
                                                to={n.link || '#'}
                                                onClick={() => !n.isRead && markRead(n._id)}
                                                className="block flex-1"
                                            >
                                                <h3 className={`text-sm font-semibold text-gray-900 ${!n.isRead ? '' : 'font-medium'}`}>
                                                    {n.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
                                                    {n.body}
                                                </p>
                                                <span className="text-[11px] text-gray-400 mt-2 block">
                                                    {formatTime(n.createdAt)}
                                                </span>
                                            </Link>
                                            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {!n.isRead && (
                                                    <button
                                                        onClick={() => markRead(n._id)}
                                                        className="p-1.5 text-blue-400 hover:text-blue-600 rounded-lg hover:bg-white transition-colors"
                                                        title="Đánh dấu đã đọc"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => remove(n._id)}
                                                    className="p-1.5 text-gray-300 hover:text-red-500 rounded-lg hover:bg-white transition-colors"
                                                    title="Xóa thông báo"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {notifications.length > 0 && (
                    <div className="mt-6 text-center">
                        <Button variant="outline" className="text-xs text-gray-500 border-gray-200">
                            Tải thêm thông báo
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
