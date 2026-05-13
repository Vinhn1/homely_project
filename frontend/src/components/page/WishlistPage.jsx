import { useEffect } from 'react';
import { Heart, MapPin, Maximize2, Trash2, Home, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useAuthStore } from '@/store/useAuthStore';
import Navbar from '../shared/Navbar';

const formatPrice = (price) => {
    if (!price) return 'Liên hệ';
    if (price >= 1000000) return (price / 1000000).toFixed(1).replace('.0', '') + ' triệu';
    return price.toLocaleString('vi-VN') + ' đ';
};

export default function WishlistPage() {
    const { wishlist, loading, fetchWishlist, toggle } = useWishlistStore();
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) fetchWishlist();
    }, [isAuthenticated]);

    const handleRemove = async (e, id) => {
        e.preventDefault();
        await toggle(id);
        fetchWishlist();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                            Phòng yêu thích
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">{wishlist.length} bài đăng đã lưu</p>
                    </div>
                    <Link to="/tim-phong">
                        <Button variant="outline" className="flex items-center gap-2 text-sm">
                            <Search className="w-4 h-4" /> Tìm thêm phòng
                        </Button>
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />
                        ))}
                    </div>
                ) : wishlist.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
                            <Heart className="w-9 h-9 text-red-300" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">Chưa có phòng yêu thích</h2>
                        <p className="text-gray-400 text-sm mb-6">Nhấn vào biểu tượng trái tim để lưu phòng bạn thích</p>
                        <Link to="/tim-phong">
                            <Button className="bg-[#1565C0] hover:bg-[#0D47A1] text-white px-8">
                                <Home className="w-4 h-4 mr-2" /> Khám phá phòng trọ
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {wishlist.map(property => {
                            const img = property.images?.[0] || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80';
                            return (
                                <div key={property._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                                    <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => navigate(`/property/${property._id}`)}>
                                        <img src={img} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        <span className="absolute top-3 left-3 bg-[#1565C0] text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                                            {property.category?.name || 'Phòng trọ'}
                                        </span>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 cursor-pointer hover:text-[#1565C0]" onClick={() => navigate(`/property/${property._id}`)}>
                                            {property.title}
                                        </h3>
                                        <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
                                            <MapPin className="w-3.5 h-3.5" />
                                            <span className="truncate">{property.location?.district?.name}, {property.location?.city}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                            <Maximize2 className="w-3.5 h-3.5" />
                                            <span>{property.area} m²</span>
                                        </div>
                                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                            <span className="text-base font-bold text-[#1565C0]">{formatPrice(property.price)}<span className="text-xs text-gray-400 font-normal">/tháng</span></span>
                                            <button
                                                onClick={(e) => handleRemove(e, property._id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Xóa khỏi yêu thích"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
