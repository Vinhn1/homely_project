import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  MapPin, 
  Maximize2, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Share2, 
  Heart, 
  Phone, 
  Mail, 
  Calendar,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  Home
} from 'lucide-react'
import { usePropertyStore } from '@/store/usePropertyStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'

export default function PropertyDetailsPage() {
  const { id } = useParams()
  const { currentProperty, fetchPropertyById, loading } = usePropertyStore()
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    fetchPropertyById(id)
    window.scrollTo(0, 0)
  }, [id, fetchPropertyById])

  if (loading && !currentProperty) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[#1565C0] animate-spin" />
          <p className="text-gray-500 font-medium animate-pulse">Đang tải thông tin tin đăng...</p>
        </div>
      </div>
    )
  }

  if (!currentProperty && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-6 bg-white">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-12 h-12 text-red-500" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Không tìm thấy tin đăng</h2>
          <p className="text-gray-500 mt-2">Tin đăng có thể đã bị gỡ hoặc đường dẫn không chính xác.</p>
        </div>
        <Link to="/">
          <Button className="bg-[#1565C0] hover:bg-[#0d47a1]">Quay lại trang chủ</Button>
        </Link>
      </div>
    )
  }

  const formatPrice = (price) => {
    if (!price) return 'Liên hệ';
    if (price >= 1000000) {
      return (price / 1000000).toFixed(1).replace('.0', '') + ' triệu';
    }
    return price.toLocaleString('vi-VN') + ' đ';
  }

  const images = currentProperty.images?.length > 0 
    ? currentProperty.images 
    : ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&auto=format&fit=crop&q=80']

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 overflow-hidden whitespace-nowrap">
          <Link to="/" className="hover:text-[#1565C0] transition-colors">Trang chủ</Link>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <Link to="/tim-phong" className="hover:text-[#1565C0] transition-colors">Tìm phòng</Link>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <span className="text-gray-900 font-medium truncate">{currentProperty.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Side: Media & Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-video rounded-3xl overflow-hidden bg-gray-100 group shadow-xl">
                <img 
                  src={images[activeImage]} 
                  alt={currentProperty.title}
                  className="w-full h-full object-cover transition-all duration-700"
                />
                
                {images.length > 1 && (
                  <>
                    <button 
                      onClick={() => setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:text-[#1565C0] transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={() => setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:text-[#1565C0] transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
                
                <div className="absolute bottom-6 right-6 px-4 py-2 bg-black/50 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/20">
                  {activeImage + 1} / {images.length}
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative w-28 aspect-[4/3] rounded-xl overflow-hidden shrink-0 border-2 transition-all ${activeImage === idx ? 'border-[#1565C0] shadow-lg ring-2 ring-blue-100' : 'border-transparent opacity-70 hover:opacity-100'}`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Header Info */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-50 text-[#1565C0] text-[10px] font-bold rounded-full uppercase tracking-widest border border-blue-100">
                  {currentProperty.category?.name || 'Phòng trọ'}
                </span>
                <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full uppercase tracking-widest border border-green-100">
                  Đã kiểm duyệt
                </span>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <h1 className="text-3xl md:text-4xl font-black text-[#021f29] leading-tight tracking-tight" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
                  {currentProperty.title}
                </h1>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="rounded-full hover:bg-red-50 hover:text-red-500 border-gray-200">
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full hover:bg-blue-50 hover:text-[#1565C0] border-gray-200">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-[#1565C0]" />
                  </div>
                  <span className="text-sm font-medium">{currentProperty.address}, {currentProperty.district?.name}, Vĩnh Long</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
                    <Maximize2 className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="text-sm font-medium">Diện tích: {currentProperty.area} m²</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                    <Star className="w-4 h-4 text-green-600 fill-green-600" />
                  </div>
                  <span className="text-sm font-medium">4.8 (24 đánh giá)</span>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Amenities */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#021f29] flex items-center gap-2">
                <div className="w-2 h-8 bg-[#1565C0] rounded-full"></div>
                Tiện ích đi kèm
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {currentProperty.amenities?.map((amenity) => (
                  <div key={amenity._id} className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-blue-100 hover:bg-blue-50/30 transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="w-5 h-5 text-[#1565C0]" />
                    </div>
                    <span className="text-gray-700 font-semibold text-sm">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Description */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#021f29] flex items-center gap-2">
                <div className="w-2 h-8 bg-[#1565C0] rounded-full"></div>
                Mô tả chi tiết
              </h3>
              <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed space-y-4">
                {currentProperty.description?.split('\n').map((para, i) => (
                  <p key={i}>{para}</p>
                )) || <p className="italic">Chưa có mô tả chi tiết cho tin đăng này.</p>}
              </div>
            </div>

            {/* Safety Note */}
            <div className="p-6 rounded-3xl bg-amber-50 border border-amber-100 flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-200 flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck className="w-6 h-6 text-amber-800" />
              </div>
              <div>
                <h4 className="font-bold text-amber-900 mb-1">Mẹo thuê phòng an toàn</h4>
                <p className="text-sm text-amber-800/80 leading-snug">
                  Đừng đặt cọc tiền trước khi xem phòng trực tiếp. Hãy luôn yêu cầu hợp đồng thuê nhà rõ ràng và kiểm tra giấy tờ pháp lý của chủ nhà.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Price & Contact Card (Sticky) */}
          <div className="space-y-6">
            <div className="sticky top-24">
              <Card className="rounded-[2rem] overflow-hidden border-0 shadow-2xl shadow-blue-900/10 border-t-4 border-[#1565C0]">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <p className="text-gray-500 text-sm font-medium mb-1">Giá thuê hàng tháng</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-[#1565C0]">{formatPrice(currentProperty.price)}</span>
                      <span className="text-gray-400 font-bold text-sm">/tháng</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between text-sm py-3 border-b border-gray-50">
                      <span className="text-gray-500">Phí dịch vụ</span>
                      <span className="font-bold text-gray-900">Miễn phí</span>
                    </div>
                    <div className="flex items-center justify-between text-sm py-3 border-b border-gray-50">
                      <span className="text-gray-500">Diện tích</span>
                      <span className="font-bold text-gray-900">{currentProperty.area} m²</span>
                    </div>
                    <div className="flex items-center justify-between text-sm py-3 border-b border-gray-50">
                      <span className="text-gray-500">Đặt cọc</span>
                      <span className="font-bold text-gray-900">1 tháng</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full h-14 rounded-2xl bg-[#1565C0] hover:bg-[#0d47a1] text-lg font-bold shadow-xl shadow-blue-900/20 gap-2">
                      <Phone className="w-5 h-5" /> {currentProperty.owner?.phone || '09xx xxx xxx'}
                    </Button>
                    <Button variant="outline" className="w-full h-14 rounded-2xl border-2 border-gray-100 font-bold text-gray-700 hover:bg-gray-50 gap-2">
                      <Mail className="w-5 h-5" /> Nhắn tin cho chủ nhà
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Owner Info Card */}
              <div className="mt-8 p-6 rounded-[2rem] bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-[#1565C0] shadow-inner border-2 border-white">
                    {currentProperty.owner?.fullName?.charAt(0) || 'H'}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{currentProperty.owner?.fullName || 'Chủ nhà Homely'}</h4>
                    <p className="text-xs text-gray-400 flex items-center gap-1 font-medium uppercase tracking-wider">
                      <Calendar className="w-3 h-3" /> Tham gia từ 2024
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-2xl bg-white shadow-sm border border-gray-50">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Tin đăng</p>
                    <p className="text-lg font-black text-[#1565C0]">12</p>
                  </div>
                  <div className="text-center p-3 rounded-2xl bg-white shadow-sm border border-gray-50">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Phản hồi</p>
                    <p className="text-lg font-black text-green-500">98%</p>
                  </div>
                </div>
                <Button variant="link" className="w-full mt-4 text-[#1565C0] font-bold text-sm">Xem trang cá nhân</Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
