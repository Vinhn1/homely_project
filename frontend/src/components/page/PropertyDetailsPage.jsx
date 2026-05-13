import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  MapPin,
  Maximize2,
  Star,
  ChevronLeft,
  ChevronRight,
  Share2,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Loader2,
  Home,
  MessageSquare,
  Send,
  Edit3,
  Trash2,
  User,
  Clock,
  Heart
} from 'lucide-react'
import { usePropertyStore } from '@/store/usePropertyStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useReviewStore } from '@/store/useReviewStore'
import { useBookingStore } from '@/store/useBookingStore'
import { useWishlistStore } from '@/store/useWishlistStore'
import { chatApi } from '@/api/chat.api'
import { adminApi } from '@/api/notification.api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import PropertyMap from '@/components/shared/PropertyMap'
import { toast } from 'sonner'

export default function PropertyDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentProperty, fetchPropertyById, deleteProperty, loading: propertyLoading } = usePropertyStore()
  const { user, isAuthenticated } = useAuthStore()
  const { reviews, fetchReviews, createReview, deleteReview, loading: reviewsLoading } = useReviewStore()
  const { createBooking, loading: bookingLoading } = useBookingStore()
  const { toggle, isSaved } = useWishlistStore()
  const [chatLoading, setChatLoading] = useState(false)
  const [adminActionLoading, setAdminActionLoading] = useState(false)

  const [activeImage, setActiveImage] = useState(0)

  // Booking state
  const [checkIn, setCheckIn] = useState('')
  const [guests, setGuests] = useState(1)

  // Review state
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  const { fetchWishlist } = useWishlistStore()

  useEffect(() => {
    fetchPropertyById(id)
    fetchReviews(id)
    if (isAuthenticated) {
      fetchWishlist()
    }
    window.scrollTo(0, 0)
  }, [id, fetchPropertyById, fetchReviews, fetchWishlist, isAuthenticated])



  if (propertyLoading && !currentProperty) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[#1565C0] animate-spin" />
          <p className="text-gray-500 font-medium animate-pulse">Đang tải thông tin tin đăng...</p>
        </div>
      </div>
    )
  }

  if (!currentProperty && !propertyLoading) {
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

  const handleProtectedAction = (actionLabel) => {
    if (!isAuthenticated) {
      toast.error(`Vui lòng đăng nhập để ${actionLabel}`)
      const currentPath = window.location.pathname
      navigate(`/login?redirect=${encodeURIComponent(currentPath)}`)
      return false
    }
    return true
  }

  const handleBooking = async (e) => {
    e.preventDefault()
    if (!handleProtectedAction('đặt phòng')) return

    if (!checkIn) {
      toast.error('Vui lòng chọn ngày nhận phòng')
      return
    }

    try {
      await createBooking({
        property: id,
        checkInDate: checkIn,
        guests: parseInt(guests) || 1,
        message: `Yêu cầu đặt phòng từ ${user.fullName || user.displayName}`
      })
      // Reset form
      setCheckIn('')
      setGuests(1)
    } catch (error) {
      // Error handled in store
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!handleProtectedAction('đánh giá')) return

    if (!comment.trim()) {
      toast.error('Vui lòng nhập nội dung đánh giá')
      return
    }

    try {
      await createReview({
        property: id,
        rating,
        comment
      })
      setComment('')
      setRating(5)
    } catch (error) {
      // Error handled in store
    }
  }

  const handleDeleteProperty = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tin đăng này?")) {
      try {
        await deleteProperty(id)
        toast.success('Xóa tin đăng thành công!')
        navigate('/profile')
      } catch (error) {
        toast.error('Xóa tin đăng thất bại.')
      }
    }
  }

  const handleToggleWishlist = async () => {
    if (!handleProtectedAction('lưu yêu thích')) return
    await toggle(id)
  }

  const handleChatWithOwner = async () => {
    if (!handleProtectedAction('chat với chủ trọ')) return
    if (user?._id === currentProperty.owner?._id) {
      toast.info('Bạn là chủ phòng này!')
      return
    }
    setChatLoading(true)
    try {
      const res = await chatApi.createOrGet({ 
        recipientId: currentProperty.owner?._id,
        propertyId: id 
      })
      const convId = res.data?.data?.conversation?._id || res.data?.data?._id
      navigate(`/tin-nhan${convId ? `?conv=${convId}` : ''}`)
    } catch {
      toast.error('Không thể mở cuộc trò chuyện')
    } finally {
      setChatLoading(false)
    }
  }

  const handleAdminUpdateStatus = async (status) => {
    setAdminActionLoading(true)
    try {
      await adminApi.updatePropertyStatus(id, { status })
      toast.success(status === 'active' ? 'Đã duyệt bài đăng' : 'Đã ẩn bài đăng')
      await fetchPropertyById(id)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cập nhật trạng thái thất bại')
    } finally {
      setAdminActionLoading(false)
    }
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

  const location = currentProperty.location || {}
  const propertyAddress = location.address || ''
  const propertyDistrictName = location.district?.name || ''
  const propertyCity = location.city || 'Vĩnh Long'
  const propertyCoordinates = location.coordinates
  const isAdmin = user?.role === 'admin'
  const listingStatus = currentProperty.listingStatus || 'active'
  const listingStatusMeta = {
    pending: {
      label: 'Chờ duyệt',
      className: 'bg-amber-50 text-amber-600 border-amber-100',
    },
    active: {
      label: 'Đã kiểm duyệt',
      className: 'bg-green-50 text-green-600 border-green-100',
    },
    hidden: {
      label: 'Đã ẩn',
      className: 'bg-red-50 text-red-600 border-red-100',
    },
    expired: {
      label: 'Hết hạn',
      className: 'bg-gray-50 text-gray-600 border-gray-100',
    },
  }[listingStatus] || {
    label: listingStatus,
    className: 'bg-gray-50 text-gray-600 border-gray-100',
  }

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

        {isAdmin && (
          <div className="mb-8 rounded-2xl border border-blue-100 bg-blue-50 p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-5 h-5 text-[#1565C0]" />
              </div>
              <div>
                <p className="font-bold text-[#021f29]">Kiểm duyệt bài đăng</p>
                <p className="text-sm text-gray-600">
                  Trạng thái hiện tại: <span className="font-bold text-[#1565C0]">{listingStatus}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {listingStatus !== 'active' && (
                <Button
                  disabled={adminActionLoading}
                  onClick={() => handleAdminUpdateStatus('active')}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-xl gap-2"
                >
                  {adminActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Duyệt bài
                </Button>
              )}
              {listingStatus !== 'hidden' && (
                <Button
                  disabled={adminActionLoading}
                  variant="outline"
                  onClick={() => handleAdminUpdateStatus('hidden')}
                  className="border-red-200 bg-white text-red-600 hover:bg-red-50 rounded-xl gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Ẩn bài
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => navigate('/admin')}
                className="rounded-xl border-blue-100 bg-white text-[#1565C0] hover:bg-blue-50"
              >
                Quay lại quản trị
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Side: Media & Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-video rounded-3xl overflow-hidden bg-gray-100 group shadow-xl border border-gray-100">
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
                <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest border ${listingStatusMeta.className}`}>
                  {listingStatusMeta.label}
                </span>
              </div>

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <h1 className="text-3xl md:text-4xl font-black text-[#021f29] leading-tight tracking-tight" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
                  {currentProperty.title}
                </h1>
                <div className="flex gap-2">
                  {user?._id === currentProperty.owner?._id && (
                    <>
                      <Button
                        variant="outline"
                        className="rounded-full bg-blue-50 text-[#1565C0] border-blue-100 hover:bg-blue-100"
                        onClick={() => navigate(`/edit-property/${id}`)}
                      >
                        <Edit3 className="w-4 h-4 mr-2" /> Sửa
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-full bg-red-50 text-red-600 border-red-100 hover:bg-red-100"
                        onClick={handleDeleteProperty}
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Xóa
                      </Button>
                    </>
                  )}
                  {(!user || user?._id !== currentProperty.owner?._id) && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleChatWithOwner}
                      disabled={chatLoading}
                      className="rounded-full hover:bg-blue-50 hover:text-[#1565C0] border-gray-200"
                      title="Nhắn tin cho chủ nhà"
                    >
                      {chatLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <MessageSquare className="w-5 h-5" />
                      )}
                    </Button>
                  )}
                  <Button variant="outline" size="icon" className="rounded-full hover:bg-blue-50 hover:text-[#1565C0] border-gray-200">
                    <Share2 className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleToggleWishlist}
                    className={`rounded-full border-gray-200 transition-all ${isSaved(id)
                        ? 'bg-red-50 text-red-500 border-red-200 hover:bg-red-100'
                        : 'hover:bg-red-50 hover:text-red-500'
                      }`}
                    title={isSaved(id) ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                  >
                    <Heart className={`w-5 h-5 transition-all ${isSaved(id) ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-[#1565C0]" />
                  </div>
                  <span className="text-sm font-medium">
                    {[propertyAddress, propertyDistrictName, propertyCity].filter(Boolean).join(', ')}
                  </span>
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
                  <span className="text-sm font-medium">
                    {currentProperty.averageRating || 0} ({currentProperty.reviewCount || 0} đánh giá)
                  </span>
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

            <hr className="border-gray-100" />

            <PropertyMap
              coordinates={propertyCoordinates}
              address={propertyAddress}
              districtName={propertyDistrictName}
              city={propertyCity}
              title={currentProperty.title}
            />

            <hr className="border-gray-100" />

            {/* Reviews Section */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#021f29] flex items-center gap-2">
                  <div className="w-2 h-8 bg-[#1565C0] rounded-full"></div>
                  Đánh giá ({reviews.length})
                </h3>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-100">
                  <Star className="w-4 h-4 text-green-600 fill-green-600" />
                  <span className="text-sm font-black text-green-700">{currentProperty.averageRating || '0.0'}</span>
                </div>
              </div>

              {/* Review Form */}
              {isAuthenticated ? (
                <Card className="rounded-[2rem] border-0 bg-blue-50/30 shadow-inner p-6">
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="flex items-center gap-4 mb-2">
                      <p className="text-sm font-bold text-gray-700">Chất lượng phòng:</p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="transition-transform active:scale-90"
                          >
                            <Star
                              className={`w-6 h-6 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="relative">
                      <Textarea
                        placeholder="Chia sẻ trải nghiệm của bạn về phòng này..."
                        className="min-h-[120px] rounded-2xl border-white bg-white shadow-sm resize-none p-4 focus-visible:ring-[#1565C0]"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <Button
                        disabled={reviewsLoading}
                        className="absolute bottom-3 right-3 bg-[#1565C0] hover:bg-[#0d47a1] rounded-xl h-10 px-4 gap-2 shadow-lg shadow-blue-900/20"
                      >
                        {reviewsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Gửi đánh giá
                      </Button>
                    </div>
                  </form>
                </Card>
              ) : (
                <div className="p-8 rounded-[2rem] border-2 border-dashed border-gray-100 bg-gray-50/50 text-center">
                  <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Bạn cần đăng nhập để viết đánh giá</p>
                  <Link to="/login">
                    <Button variant="link" className="text-[#1565C0] font-bold">Đăng nhập ngay</Button>
                  </Link>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review._id} className="flex gap-4 p-6 rounded-3xl bg-white border border-gray-50 hover:shadow-xl hover:shadow-gray-100 transition-all group">
                      <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0 text-blue-600 font-bold shadow-inner overflow-hidden">
                        {review.user?.avatarUrl ? (
                          <img src={review.user.avatarUrl} alt={review.user.displayName} className="w-full h-full object-cover" />
                        ) : (
                          review.user?.displayName?.charAt(0) || 'U'
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-gray-900">{review.user?.displayName}</h4>
                            <div className="flex items-center gap-2">
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                                  />
                                ))}
                              </div>
                              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                          </div>
                          {user?._id === review.user?._id && (
                            <button
                              onClick={() => deleteReview(review._id)}
                              className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 opacity-50">
                    <p className="text-gray-500 italic">Chưa có đánh giá nào cho phòng này.</p>
                  </div>
                )}
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

          {/* Right Side: Booking Card (Sticky) */}
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

                  <form onSubmit={handleBooking} className="space-y-4 mb-8">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Ngày nhận phòng dự kiến</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1565C0]" />
                        <Input
                          type="date"
                          className="h-12 pl-12 rounded-xl border-gray-100 bg-gray-50/50 focus-visible:ring-[#1565C0]"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Số lượng người ở</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1565C0]" />
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          className="h-12 pl-12 rounded-xl border-gray-100 bg-gray-50/50 focus-visible:ring-[#1565C0]"
                          value={guests}
                          onChange={(e) => setGuests(e.target.value)}
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={bookingLoading}
                      className="w-full h-14 rounded-2xl bg-[#1565C0] hover:bg-[#0d47a1] text-lg font-bold shadow-xl shadow-blue-900/20 gap-2 mt-4"
                    >
                      {bookingLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : !isAuthenticated ? (
                        <Send className="w-5 h-5" />
                      ) : (
                        <Home className="w-5 h-5" />
                      )}
                      {isAuthenticated ? 'Đặt phòng ngay' : 'Đăng nhập để đặt phòng'}
                    </Button>
                  </form>

                  <div className="space-y-3 pt-6 border-t border-gray-100">
                    <Button variant="outline" className="w-full h-12 rounded-2xl border-gray-100 font-bold text-gray-700 hover:bg-gray-50 gap-2">
                      <Phone className="w-4 h-4 text-green-600" /> {currentProperty.owner?.phone || 'Liên hệ để lấy số'}
                    </Button>
                    {/* Ẩn nút chat nếu user là chủ phòng */}
                    {(!user || user?._id !== currentProperty.owner?._id) && (
                      <Button
                        onClick={handleChatWithOwner}
                        disabled={chatLoading}
                        className="w-full h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold gap-2 shadow-md shadow-emerald-900/10"
                      >
                        {chatLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <MessageSquare className="w-4 h-4" />
                        )}
                        Chat với chủ trọ
                      </Button>
                    )}
                  </div>

                  <p className="text-[10px] text-gray-400 text-center mt-4 font-medium italic">
                    Bạn sẽ không bị trừ tiền ngay lúc này. Chủ nhà sẽ liên hệ lại để xác nhận.
                  </p>
                </CardContent>
              </Card>

              {/* Owner Info Card */}
              <div className="mt-8 p-6 rounded-[2rem] bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-[#1565C0] shadow-inner border-2 border-white overflow-hidden">
                    {currentProperty.owner?.avatarUrl ? (
                      <img src={currentProperty.owner.avatarUrl} alt={currentProperty.owner.displayName} className="w-full h-full object-cover" />
                    ) : (
                      currentProperty.owner?.displayName?.charAt(0) || 'H'
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{currentProperty.owner?.displayName || 'Chủ nhà Homely'}</h4>
                    <p className="text-xs text-gray-400 flex items-center gap-1 font-medium uppercase tracking-wider">
                      <Calendar className="w-3 h-3" /> Thành viên từ 2024
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
                {(!user || user?._id !== currentProperty.owner?._id) && (
                  <Button
                    onClick={handleChatWithOwner}
                    disabled={chatLoading}
                    className="w-full mt-4 h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 shadow-lg shadow-blue-900/10"
                  >
                    {chatLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <MessageSquare className="w-4 h-4" />
                    )}
                    Nhắn tin cho chủ nhà
                  </Button>
                )}
                <Button variant="link" className="w-full mt-2 text-[#1565C0] font-bold text-sm">Xem trang cá nhân</Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
