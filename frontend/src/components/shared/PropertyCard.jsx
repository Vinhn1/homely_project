import { Link, useNavigate } from 'react-router-dom'
import { MapPin, Star, Maximize2, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuthStore } from '@/store/useAuthStore'
import { useWishlistStore } from '@/store/useWishlistStore'
import { toast } from 'sonner'

function Stars({ rating, count }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`w-3 h-3 ${i < Math.floor(rating || 0) ? 'fill-[#FFA726] text-[#FFA726]' : 'fill-gray-200 text-gray-200'}`} />
        ))}
      </div>
      <span className="text-xs text-gray-500 ml-1">{rating || 0} ({count || 0})</span>
    </div>
  )
}

export default function PropertyCard({ property }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { toggle, isSaved } = useWishlistStore();

  const handleToggleWishlist = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để lưu tin');
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }
    await toggle(property._id);
  };

  const handleDetailsClick = (e) => {
    e.preventDefault();
    navigate(`/property/${property._id}`);
  };

  const formatPrice = (price) => {
    if (!price) return 'Liên hệ';
    if (price >= 1000000) {
      return (price / 1000000).toFixed(1).replace('.0', '') + ' triệu';
    }
    return price.toLocaleString('vi-VN') + ' đ';
  };

  const mainImage = property.images && property.images.length > 0 
    ? property.images[0] 
    : 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=80';

  return (
    <Card className="group overflow-hidden border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.14)] transition-shadow duration-300 rounded-2xl p-0 h-full flex flex-col">
      {/* Image */}
      <div 
        onClick={handleDetailsClick}
        className="relative overflow-hidden h-52 shrink-0 cursor-pointer"
      >
        <img 
          src={mainImage} 
          alt={property.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          loading="lazy" 
        />

        {/* Type badge */}
        <span className="absolute top-3 left-3 bg-[#1565C0] text-white text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-lg shadow-lg">
          {property.category?.name || 'Phòng trọ'}
        </span>

        {/* New badge */}
        <span className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
          <Star className="w-3 h-3 fill-white" /> Tin mới
        </span>

        {/* Favorite button overlay */}
        <button 
          onClick={handleToggleWishlist}
          className={`absolute bottom-3 right-3 p-2.5 rounded-full shadow-lg transition-all z-10 group/heart ${
            isSaved(property._id) 
              ? 'bg-red-50 text-red-500' 
              : 'bg-white/90 text-gray-400 hover:text-red-500'
          }`}
          title={isSaved(property._id) ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
        >
          <Heart className={`w-4 h-4 transition-all ${isSaved(property._id) ? 'fill-red-500' : 'group-hover/heart:fill-red-500'}`} />
        </button>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col">
        <h3 
          onClick={handleDetailsClick}
          className="font-bold text-[#021f29] text-[15px] leading-snug mb-2 line-clamp-2 group-hover:text-[#1565C0] transition-colors min-h-[40px] cursor-pointer"
        >
          {property.title}
        </h3>

        <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
          <MapPin className="w-3.5 h-3.5 text-[#42A5F5] shrink-0" />
          <span className="truncate">{property.district?.name || property.address}, Vĩnh Long</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
            <Maximize2 className="w-3.5 h-3.5 text-gray-400" />
            <span>{property.area} m²</span>
          </div>
          <Stars rating={property.rating} count={property.reviewCount} />
        </div>

        {/* Amenities / Tags */}
        <div className="flex gap-1.5 flex-wrap mb-4 overflow-hidden h-[24px]">
          {property.amenities?.slice(0, 3).map(amenity => (
            <span key={amenity._id} className="text-[10px] bg-blue-50 text-[#1565C0] px-2 py-0.5 rounded-md font-semibold border border-blue-100">
              {amenity.name}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-lg font-black text-[#1565C0]">{formatPrice(property.price)}</span>
            <span className="text-[10px] text-gray-400 ml-1 font-medium">/tháng</span>
          </div>
          <Button 
            size="sm" 
            onClick={handleDetailsClick}
            className="bg-[#1565C0] hover:bg-[#0d47a1] text-white text-xs h-9 px-4 rounded-xl font-bold shadow-md shadow-blue-900/10"
          >
            Chi tiết
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
