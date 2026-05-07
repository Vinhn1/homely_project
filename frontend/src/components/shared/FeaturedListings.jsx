import { Link } from 'react-router-dom'
import { MapPin, Star, Heart, ArrowRight, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const LISTINGS = [
  {
    id: 1, title: 'Studio Cửa Sổ Lớn Ban Công Rộng',
    location: 'Quận 7, Hồ Chí Minh', price: '4.5 triệu', type: 'Phòng trọ',
    area: '28m²', rating: 4.8, reviews: 24, verified: true,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=80',
    tags: ['Có nội thất', 'Wifi', 'Điều hòa'],
  },
  {
    id: 2, title: 'Nhà Nguyên Căn Hẻm Xe Hơi Yên Tĩnh',
    location: 'Quận Phú Nhuận, Hồ Chí Minh', price: '12 triệu', type: 'Nhà nguyên căn',
    area: '75m²', rating: 4.9, reviews: 41, verified: true,
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&auto=format&fit=crop&q=80',
    tags: ['3 phòng ngủ', 'Sân thượng', 'Bãi xe'],
  },
  {
    id: 3, title: 'Căn Hộ Mini Đầy Đủ Nội Thất Cao Cấp',
    location: 'Quận Cầu Giấy, Hà Nội', price: '5.5 triệu', type: 'Căn hộ',
    area: '35m²', rating: 4.7, reviews: 18, verified: true,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80',
    tags: ['Nội thất cao cấp', 'An ninh', 'Hồ bơi'],
  },
  {
    id: 4, title: 'Phòng Ở Ghép Gần ĐH Bách Khoa',
    location: 'Quận 10, Hồ Chí Minh', price: '2.2 triệu', type: 'Ở ghép',
    area: '15m²', rating: 4.6, reviews: 32, verified: false,
    image: 'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=600&auto=format&fit=crop&q=80',
    tags: ['Gần trường', 'Wifi', 'Giờ tự do'],
  },
  {
    id: 5, title: 'Căn Hộ Cao Cấp View Hồ Tây',
    location: 'Quận Tây Hồ, Hà Nội', price: '18 triệu', type: 'Căn hộ',
    area: '90m²', rating: 5.0, reviews: 67, verified: true,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=80',
    tags: ['2 phòng ngủ', 'Phòng gym', 'View đẹp'],
  },
  {
    id: 6, title: 'Studio Mới 100% Trung Tâm Đà Nẵng',
    location: 'Quận Hải Châu, Đà Nẵng', price: '6 triệu', type: 'Phòng trọ',
    area: '30m²', rating: 4.8, reviews: 15, verified: true,
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&auto=format&fit=crop&q=80',
    tags: ['Mới bàn giao', 'Full nội thất', 'Gần biển'],
  },
]

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-[#FFA726] text-[#FFA726]' : 'fill-gray-200 text-gray-200'}`} />
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating}</span>
    </div>
  )
}

function PropertyCard({ l }) {
  return (
    <Card className="group overflow-hidden border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.14)] transition-shadow duration-300 rounded-2xl p-0">
      {/* Image */}
      <div className="relative overflow-hidden h-52">
        <img src={l.image} alt={l.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />

        {/* Type badge */}
        <span className="absolute top-3 left-3 bg-[#1565C0] text-white text-xs font-semibold px-2 py-1 rounded-lg">
          {l.type}
        </span>

        {/* Verified */}
        {l.verified && (
          <span className="absolute top-3 right-10 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-lg flex items-center gap-1">
            <Star className="w-3 h-3 fill-white" /> Xác minh
          </span>
        )}

        {/* Heart */}
        <button className="absolute top-3 right-3 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
          <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
        </button>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-[#021f29] text-sm leading-snug mb-2 line-clamp-2 group-hover:text-[#1565C0] transition-colors">
          {l.title}
        </h3>

        <div className="flex items-center gap-1 text-gray-500 text-xs mb-2">
          <MapPin className="w-3 h-3 text-[#42A5F5] shrink-0" />
          <span className="truncate">{l.location}</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Maximize2 className="w-3 h-3" />
            <span>{l.area}</span>
          </div>
          <Stars rating={l.rating} />
        </div>

        {/* Tags */}
        <div className="flex gap-1 flex-wrap mb-4">
          {l.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs bg-blue-50 text-[#1565C0] px-2 py-0.5 rounded-full font-medium">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-lg font-bold text-[#1565C0]">{l.price}</span>
            <span className="text-xs text-gray-400">/tháng</span>
          </div>
          <Link to={`/phong/${l.id}`}>
            <Button size="sm" className="bg-[#1565C0] hover:bg-[#0d47a1] text-white text-xs h-8">
              Xem chi tiết
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function FeaturedListings() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-[#021f29] mb-2" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
              Tin đăng nổi bật
            </h2>
            <p className="text-gray-500">Khám phá những không gian sống vừa được cập nhật.</p>
          </div>
          <Link to="/tim-phong">
            <Button variant="outline" className="border-[#1565C0] text-[#1565C0] hover:bg-blue-50 gap-2">
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {LISTINGS.map(l => <PropertyCard key={l.id} l={l} />)}
        </div>
      </div>
    </section>
  )
}
