import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Home,
    Users,
    ShieldAlert,
    BarChart3,
    Search,
    CheckCircle2,
    XCircle,
    MoreVertical,
    Eye,
    AlertTriangle,
    Check,
    Clock
} from 'lucide-react';
import { adminApi } from '@/api/notification.api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Navbar from '../shared/Navbar';

// Sub-components
const StatsCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
    </div>
);

export default function AdminPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const [data, setData] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [status, setStatus] = useState('pending');

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        if (activeTab === 'properties') fetchProperties();
        if (activeTab === 'users') fetchUsers();
        if (activeTab === 'reports') fetchReports();
    }, [activeTab, status]);

    const fetchStats = async () => {
        try {
            const res = await adminApi.getStats();
            setStats(res.data.data);
            setLoading(false);
        } catch {
            setLoading(false);
        }
    };

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const res = await adminApi.getProperties({ status, keyword });
            setData(res.data.data.properties);
            setLoading(false);
        } catch { setLoading(false); }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await adminApi.getUsers({ keyword });
            setData(res.data.data.users);
            setLoading(false);
        } catch { setLoading(false); }
    };

    const fetchReports = async () => {
        setLoading(true);
        try {
            const res = await adminApi.getReports({ status: 'pending' });
            setData(res.data.data.reports);
            setLoading(false);
        } catch { setLoading(false); }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await adminApi.updatePropertyStatus(id, { status: newStatus });
            toast.success('Cập nhật trạng thái thành công');
            fetchProperties();
            fetchStats();
        } catch { toast.error('Cập nhật thất bại'); }
    };

    const handleToggleBanUser = async (user) => {
        const nextBannedState = !user.isBanned;
        const banReason = nextBannedState ? 'Tài khoản vi phạm chính sách hệ thống' : '';

        try {
            await adminApi.banUser(user._id, {
                isBanned: nextBannedState,
                banReason
            });
            toast.success(nextBannedState ? 'Đã khóa tài khoản' : 'Đã mở khóa tài khoản');
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Cập nhật người dùng thất bại');
        }
    };

    const handleUpdateUserRole = async (user, role) => {
        try {
            await adminApi.updateUserRole(user._id, { role });
            toast.success(role === 'owner' ? 'Đã duyệt thành chủ nhà' : 'Đã chuyển về thành viên');
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Cập nhật vai trò thất bại');
        }
    };

    const handleResolveReport = async (id, action) => {
        try {
            await adminApi.resolveReport(id, { action, adminNote: 'Admin đã xử lý' });
            toast.success('Đã xử lý báo cáo');
            fetchReports();
        } catch { toast.error('Lỗi xử lý'); }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-64 bg-white border-r border-gray-100 p-4 hidden lg:flex flex-col gap-2">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-4">Menu Quản trị</h2>
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-blue-50 text-[#1565C0] font-semibold' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <LayoutDashboard className="w-5 h-5" /> Tổng quan
                    </button>
                    <button
                        onClick={() => setActiveTab('properties')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'properties' ? 'bg-blue-50 text-[#1565C0] font-semibold' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Home className="w-5 h-5" /> Bài đăng
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'users' ? 'bg-blue-50 text-[#1565C0] font-semibold' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Users className="w-5 h-5" /> Người dùng
                    </button>
                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'reports' ? 'bg-blue-50 text-[#1565C0] font-semibold' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <ShieldAlert className="w-5 h-5" /> Báo cáo vi phạm
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-8">
                    {activeTab === 'dashboard' && (
                        <div className="space-y-8">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Tổng quan hệ thống</h1>
                                <p className="text-gray-500 text-sm">Thống kê hoạt động của Homely</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatsCard title="Tổng bài đăng" value={stats?.totalProperties || 0} icon={Home} color="bg-blue-50 text-blue-600" />
                                <StatsCard title="Chờ duyệt" value={stats?.pendingProperties || 0} icon={Clock} color="bg-amber-50 text-amber-600" />
                                <StatsCard title="Người dùng" value={stats?.totalUsers || 0} icon={Users} color="bg-green-50 text-green-600" />
                                <StatsCard title="Báo cáo mới" value={stats?.pendingReports || 0} icon={ShieldAlert} color="bg-red-50 text-red-600" />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-80 flex flex-col items-center justify-center text-gray-400">
                                    <BarChart3 className="w-12 h-12 mb-2 opacity-20" />
                                    <p>Biểu đồ tăng trưởng (Coming soon)</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-80 flex flex-col items-center justify-center text-gray-400">
                                    <BarChart3 className="w-12 h-12 mb-2 opacity-20" />
                                    <p>Phân bổ theo khu vực (Coming soon)</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'properties' && (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <h1 className="text-xl font-bold text-gray-900">Quản lý bài đăng</h1>
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            value={keyword}
                                            onChange={e => setKeyword(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && fetchProperties()}
                                            placeholder="Tìm theo tên..."
                                            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <select
                                        value={status}
                                        onChange={e => setStatus(e.target.value)}
                                        className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none"
                                    >
                                        <option value="pending">Chờ duyệt</option>
                                        <option value="active">Đã duyệt</option>
                                        <option value="hidden">Đã ẩn</option>
                                        <option value="expired">Hết hạn</option>
                                    </select>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Bài đăng</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Chủ nhà</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Giá</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {loading ? (
                                            [...Array(5)].map((_, i) => <tr key={i} className="h-20 animate-pulse bg-gray-50/50" />)
                                        ) : data.length === 0 ? (
                                            <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-400">Không có bài đăng nào</td></tr>
                                        ) : data.map(prop => (
                                            <tr
                                                key={prop._id}
                                                className="hover:bg-gray-50 transition-colors cursor-pointer"
                                                onClick={() => navigate(`/property/${prop._id}`)}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img src={prop.images?.[0]} alt={prop.title} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                                                        <div className="max-w-[200px]">
                                                            <p className="font-semibold text-gray-900 text-sm truncate hover:text-[#1565C0]">{prop.title}</p>
                                                            <p className="text-xs text-gray-500 truncate">{prop.location?.address}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {prop.owner?.displayName}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                                                    {prop.price?.toLocaleString()}đ
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            title="Xem chi tiết"
                                                            onClick={(event) => {
                                                                event.stopPropagation();
                                                                navigate(`/property/${prop._id}`);
                                                            }}
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        {(prop.listingStatus === 'pending' || prop.listingStatus === 'hidden') && (
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                className="text-green-600 hover:bg-green-50"
                                                                onClick={(event) => {
                                                                    event.stopPropagation();
                                                                    handleUpdateStatus(prop._id, 'active');
                                                                }}
                                                                title="Phê duyệt"
                                                            >
                                                                <CheckCircle2 className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                        {(prop.listingStatus === 'pending' || prop.listingStatus === 'active') && (
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                className="text-red-600 hover:bg-red-50"
                                                                onClick={(event) => {
                                                                    event.stopPropagation();
                                                                    handleUpdateStatus(prop._id, 'hidden');
                                                                }}
                                                                title={prop.listingStatus === 'pending' ? 'Từ chối/ẩn bài đăng' : 'Ẩn bài đăng'}
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h1 className="text-xl font-bold text-gray-900">Quản lý người dùng</h1>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        value={keyword}
                                        onChange={e => setKeyword(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && fetchUsers()}
                                        placeholder="Tên hoặc email..."
                                        className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none"
                                    />
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-sm">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Người dùng</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Vai trò</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Trạng thái</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {data.map(u => (
                                            <tr key={u._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                                                            {u.avatarUrl ? <img src={u.avatarUrl} className="w-full h-full rounded-full object-cover" /> : u.displayName[0]}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900">{u.displayName}</p>
                                                            <p className="text-[11px] text-gray-500">{u.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-600' : u.role === 'owner' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-600'}`}>
                                                        {u.role.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`flex items-center gap-1 ${u.isBanned ? 'text-red-500' : 'text-green-500'}`}>
                                                        {u.isBanned ? <XCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                                                        {u.isBanned ? 'Bị khóa' : 'Hoạt động'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {u.role === 'admin' ? (
                                                        <Button variant="ghost" size="icon" disabled title="Không thể khóa admin">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </Button>
                                                    ) : (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                disabled={u.isBanned}
                                                                className="text-blue-600 hover:bg-blue-50 disabled:opacity-40"
                                                                title={u.role === 'owner' ? 'Chuyển về thành viên' : 'Duyệt thành chủ nhà'}
                                                                onClick={() => handleUpdateUserRole(u, u.role === 'owner' ? 'user' : 'owner')}
                                                            >
                                                                {u.role === 'owner' ? <Users className="w-4 h-4" /> : <Home className="w-4 h-4" />}
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className={u.isBanned ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'}
                                                                title={u.isBanned ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                                                                onClick={() => handleToggleBanUser(u)}
                                                            >
                                                                {u.isBanned ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                                            </Button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'reports' && (
                        <div className="space-y-6">
                            <h1 className="text-xl font-bold text-gray-900">Báo cáo vi phạm</h1>
                            <div className="grid grid-cols-1 gap-4">
                                {data.map(report => (
                                    <div key={report._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                                                <AlertTriangle className="w-6 h-6 text-red-500" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-bold text-gray-900 text-base">{report.reason === 'fake_info' ? 'Thông tin ảo' : report.reason}</h3>
                                                    <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">#{report._id.slice(-6)}</span>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                                                <div className="flex items-center gap-3 text-[11px] text-gray-400">
                                                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Từ: {report.reporter?.displayName}</span>
                                                    <span className="flex items-center gap-1"><Home className="w-3 h-3" /> Bài: {report.property?.title}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-xs text-green-600 border-green-200 hover:bg-green-50"
                                                onClick={() => handleResolveReport(report._id, 'resolve')}
                                            >
                                                <Check className="w-3.5 h-3.5 mr-1" /> Giải quyết
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-xs text-gray-500 border-gray-200"
                                                onClick={() => handleResolveReport(report._id, 'dismiss')}
                                            >
                                                Bỏ qua
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {data.length === 0 && (
                                    <div className="py-20 text-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
                                        <ShieldAlert className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                        <p>Không có báo cáo nào cần xử lý</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
