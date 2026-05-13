import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  Edit3, 
  Camera, 
  MapPin, 
  Settings, 
  Bell, 
  Star, 
  List,
  CheckCircle2,
  Save,
  XCircle,
  Loader2,
  Trash2,
  Check,
  X,
  ExternalLink,
  ChevronRight
} from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import PropertyCard from '@/components/shared/PropertyCard'
import { useAuthStore } from '@/store/useAuthStore'
import { usePropertyStore } from '@/store/usePropertyStore'
import { useBookingStore } from '@/store/useBookingStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function ProfilePage() {
  const { user, updateProfile, updateAvatar, deleteAccount } = useAuthStore()
  const { properties, fetchMyProperties, deleteProperty, loading: propertiesLoading } = usePropertyStore()
  const { myBookings, propertyBookings, fetchMyBookings, fetchOwnerRequests, updateBookingStatus, loading: bookingsLoading } = useBookingStore()
  
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('info')
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    displayName: '',
    phone: '',
    bio: '',
    avatarUrl: ''
  })

  // Sync form data with user data
  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        phone: user.phone || '',
        bio: user.bio || '',
        avatarUrl: user.avatarUrl || ''
      })
    }
  }, [user])

  // Fetch data based on active tab
  useEffect(() => {
    // Luôn fetch bài đăng của tôi để hiển thị stats và tab 'Bài đăng của tôi'
    fetchMyProperties()
    fetchMyBookings()
    
    if (activeTab === 'requests' && user?.role === 'owner') {
      fetchOwnerRequests()
    }
  }, [activeTab, user?.role, fetchMyProperties, fetchMyBookings, fetchOwnerRequests])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await updateProfile(formData)
      toast.success('Cập nhật hồ sơ thành công!')
      setIsEditing(false)
    } catch (error) {
      toast.error(error.message || 'Cập nhật thất bại. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return toast.error('Vui lòng chọn tệp hình ảnh.')
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return toast.error('Kích thước ảnh tối đa là 2MB.')
    }

    setIsUploading(true)
    const uploadToast = toast.loading('Đang tải ảnh lên...')
    
    try {
      await updateAvatar(file)
      toast.success('Cập nhật ảnh đại diện thành công!', { id: uploadToast })
    } catch (error) {
      toast.error(error.message || 'Tải ảnh lên thất bại.', { id: uploadToast })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa tài khoản? Tất cả dữ liệu và tin đăng của bạn sẽ bị xóa vĩnh viễn và không thể khôi phục.")
    if (!confirmDelete) return

    setIsLoading(true)
    try {
      await deleteAccount()
      toast.success('Xóa tài khoản thành công. Tạm biệt!')
      navigate('/')
    } catch (error) {
      toast.error(error.message || 'Xóa tài khoản thất bại.')
    } finally {
      setIsLoading(false)
    }
  }

  const stats = [
    { label: 'Tin đã đăng', value: properties?.length || 0, icon: List },
    { label: 'Lượt đặt', value: myBookings?.length || 0, icon: Bell },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100'
      case 'confirmed': return 'bg-green-50 text-green-600 border-green-100'
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100'
      case 'completed': return 'bg-blue-50 text-blue-600 border-blue-100'
      default: return 'bg-gray-50 text-gray-600 border-gray-100'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ duyệt'
      case 'confirmed': return 'Đã xác nhận'
      case 'cancelled': return 'Đã hủy'
      case 'completed': return 'Hoàn thành'
      default: return status
    }
  }

  const handleDeleteProperty = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tin đăng này?")) {
      try {
        await deleteProperty(id)
      } catch (error) {
        // Lỗi đã được toast trong store
      }
    }
  }

  const handleUpdateBooking = async (id, status) => {
    await updateBookingStatus(id, status)
  }

  return (
    <div className="min-h-screen bg-[#f3faff]" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* ── Left Column: Profile Card ── */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 overflow-hidden border border-blue-50">
              {/* Cover Header */}
              <div className="h-32 bg-gradient-to-r from-[#1565C0] to-[#0d47a1] relative">
                <button 
                  onClick={() => setActiveTab('settings')}
                  className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>

              {/* Profile Info */}
              <div className="px-6 pb-8 text-center -mt-16">
                <div className="relative inline-block group">
                  <div className="w-32 h-32 rounded-3xl bg-white p-1.5 shadow-2xl relative z-10 mx-auto overflow-hidden border border-blue-100">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                      <div className="w-full h-full bg-[#f3faff] flex items-center justify-center rounded-2xl">
                        <UserIcon className="w-12 h-12 text-[#1565C0]" />
                      </div>
                    )}
                    
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/40 z-20 flex items-center justify-center rounded-2xl">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  
                  <label className="absolute bottom-1 right-1 z-20 p-2 bg-[#FFA726] hover:bg-[#FB8C00] text-white rounded-xl shadow-lg transition-all transform group-hover:scale-110 cursor-pointer">
                    <Camera className="w-4 h-4" />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleAvatarChange}
                      disabled={isUploading}
                    />
                  </label>
                </div>

                <div className="mt-4">
                  <h2 className="text-2xl font-bold text-[#021f29] flex items-center justify-center gap-2">
                    {user?.displayName}
                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  </h2>
                  <p className="text-gray-500 font-medium lowercase italic">@{user?.username}</p>
                </div>

                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[#1565C0] text-xs font-bold rounded-full border border-blue-100 uppercase tracking-wider">
                  <Shield className="w-3 h-3" />
                  {user?.role === 'owner' ? 'Chủ nhà uy tín' : 'Thành viên'}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mt-8 border-t border-b border-gray-100 py-6">
                  {stats.map((s) => (
                    <div key={s.label}>
                      <p className="text-xl font-bold text-[#1565C0]">{s.value}</p>
                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 space-y-3 text-left">
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-9 h-9 bg-[#f3faff] rounded-xl flex items-center justify-center text-[#1565C0]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase leading-none mb-1">Email</p>
                      <p className="text-sm font-semibold truncate max-w-[200px]">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-9 h-9 bg-[#f3faff] rounded-xl flex items-center justify-center text-[#1565C0]">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase leading-none mb-1">Số điện thoại</p>
                      <p className="text-sm font-semibold">{user?.phone || 'Chưa cập nhật'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-9 h-9 bg-[#f3faff] rounded-xl flex items-center justify-center text-[#1565C0]">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase leading-none mb-1">Ngày tham gia</p>
                      <p className="text-sm font-semibold">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        }) : '---'}
                      </p>
                    </div>
                  </div>
                </div>

                {!isEditing && (
                  <Button 
                    onClick={() => {
                      setActiveTab('info')
                      setIsEditing(true)
                    }}
                    className="w-full mt-8 bg-[#1565C0] hover:bg-[#0d47a1] text-white font-bold h-12 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/10"
                  >
                    <Edit3 className="w-4 h-4" />
                    Chỉnh sửa hồ sơ
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* ── Right Column: Activity / Tabs ── */}
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Tab Header */}
            <div className="bg-white p-1.5 rounded-2xl shadow-lg shadow-blue-900/5 flex gap-1 border border-blue-50">
              <button
                onClick={() => { setActiveTab('info'); setIsEditing(false); }}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'info' 
                  ? 'bg-[#1565C0] text-white shadow-md shadow-blue-900/20' 
                  : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                Cá nhân
              </button>
              <button
                onClick={() => { setActiveTab('listings'); setIsEditing(false); }}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'listings' 
                  ? 'bg-[#1565C0] text-white shadow-md shadow-blue-900/20' 
                  : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                Bài đăng của tôi
              </button>
              {user?.role === 'owner' && (
                <button
                  onClick={() => { setActiveTab('requests'); setIsEditing(false); }}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                    activeTab === 'requests' 
                    ? 'bg-[#1565C0] text-white shadow-md shadow-blue-900/20' 
                    : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Yêu cầu
                </button>
              )}
              <button
                onClick={() => { setActiveTab('bookings'); setIsEditing(false); }}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'bookings' 
                  ? 'bg-[#1565C0] text-white shadow-md shadow-blue-900/20' 
                  : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                Đã đặt
              </button>
              <button
                onClick={() => { setActiveTab('settings'); setIsEditing(false); }}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'settings' 
                  ? 'bg-[#1565C0] text-white shadow-md shadow-blue-900/20' 
                  : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                Cài đặt
              </button>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 p-8 border border-blue-50 flex-1 min-h-[500px]">
              {activeTab === 'info' && (
                <div className="h-full">
                  {!isEditing ? (
                    /* VIEW MODE */
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div>
                        <h3 className="text-xl font-bold text-[#021f29] mb-6 flex items-center gap-2">
                          <div className="w-2 h-6 bg-[#FFA726] rounded-full" />
                          Giới thiệu bản thân
                        </h3>
                        <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 text-gray-600 leading-relaxed italic">
                          {user?.bio || "Thành viên chưa cập nhật thông tin giới thiệu. Việc cập nhật giới thiệu giúp tăng độ tin cậy khi liên hệ với chủ nhà hoặc người thuê."}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-[#021f29] mb-6 flex items-center gap-2">
                          <div className="w-2 h-6 bg-[#FFA726] rounded-full" />
                          Địa chỉ liên hệ
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-5 border border-gray-100 rounded-2xl flex items-center gap-4 hover:border-[#1565C0]/30 transition-all group">
                            <div className="w-12 h-12 bg-[#f3faff] rounded-xl flex items-center justify-center text-[#1565C0] group-hover:bg-[#1565C0] group-hover:text-white transition-all">
                              <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 font-bold uppercase">Khu vực</p>
                              <p className="font-semibold text-gray-700">TP. Hồ Chí Minh, Việt Nam</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* EDIT MODE */
                    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-[#021f29] flex items-center gap-2">
                          <div className="w-2 h-6 bg-[#FFA726] rounded-full" />
                          Chỉnh sửa thông tin
                        </h3>
                        <div className="flex gap-2">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={() => setIsEditing(false)}
                            className="rounded-xl"
                          >
                            Hủy
                          </Button>
                          <Button 
                            type="submit" 
                            disabled={isLoading}
                            className="bg-[#1565C0] hover:bg-[#0d47a1] text-white font-bold rounded-xl px-6 flex items-center gap-2"
                          >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Lưu thay đổi
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="displayName" className="text-sm font-bold text-gray-700">Tên hiển thị</Label>
                          <Input 
                            id="displayName"
                            name="displayName"
                            value={formData.displayName}
                            onChange={handleChange}
                            placeholder="Nhập tên hiển thị của bạn"
                            className="rounded-xl border-gray-100 focus:ring-[#1565C0]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-sm font-bold text-gray-700">Số điện thoại</Label>
                          <Input 
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="09xx xxx xxx"
                            className="rounded-xl border-gray-100 focus:ring-[#1565C0]"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="bio" className="text-sm font-bold text-gray-700">Giới thiệu</Label>
                          <Textarea 
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Viết một chút về bản thân bạn..."
                            className="rounded-2xl border-gray-100 focus:ring-[#1565C0] min-h-[120px]"
                          />
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {activeTab === 'listings' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-[#021f29] flex items-center gap-2">
                      <div className="w-2 h-6 bg-[#FFA726] rounded-full" />
                      Bài đăng của tôi
                    </h3>
                    <Button 
                      onClick={() => navigate('/dang-tin')}
                      className="bg-[#1565C0] hover:bg-[#0d47a1] text-white font-bold rounded-xl"
                    >
                      Đăng tin mới
                    </Button>
                  </div>

                  {propertiesLoading ? (
                    <div className="flex items-center justify-center py-20">
                      <Loader2 className="w-10 h-10 text-[#1565C0] animate-spin" />
                    </div>
                  ) : properties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {properties.map(property => (
                        <div key={property._id} className="relative group">
                          <PropertyCard property={property} />
                          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => navigate(`/edit-property/${property._id}`)}
                              className="w-8 h-8 bg-white text-blue-600 rounded-lg shadow-lg flex items-center justify-center hover:bg-blue-50"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProperty(property._id)}
                              className="w-8 h-8 bg-white text-red-600 rounded-lg shadow-lg flex items-center justify-center hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center py-20">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <List className="w-10 h-10 text-gray-300" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-700">Chưa có tin đăng nào</h4>
                      <p className="text-gray-500 max-w-xs mx-auto mt-2 mb-6">
                        Bắt đầu chia sẻ phòng trọ hoặc căn hộ của bạn để tiếp cận hàng nghìn người thuê.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'requests' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <h3 className="text-xl font-bold text-[#021f29] mb-6 flex items-center gap-2">
                    <div className="w-2 h-6 bg-[#FFA726] rounded-full" />
                    Yêu cầu thuê phòng
                  </h3>

                  {bookingsLoading ? (
                    <div className="flex items-center justify-center py-20">
                      <Loader2 className="w-10 h-10 text-[#1565C0] animate-spin" />
                    </div>
                  ) : propertyBookings.length > 0 ? (
                    <div className="space-y-4">
                      {propertyBookings.map(booking => (
                        <div key={booking._id} className="p-6 bg-white border border-gray-100 rounded-3xl hover:border-blue-200 transition-all shadow-sm">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-start gap-4">
                              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                                {booking.user?.avatarUrl ? (
                                  <img src={booking.user.avatarUrl} alt="" className="w-full h-full object-cover rounded-2xl" />
                                ) : (
                                  <UserIcon className="w-6 h-6 text-[#1565C0]" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-bold text-[#021f29]">{booking.user?.displayName || 'Người dùng'}</h4>
                                <p className="text-sm text-gray-500 mb-2">Đã yêu cầu: {booking.property?.title}</p>
                                <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-400">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    Dời vào: {new Date(booking.checkInDate).toLocaleDateString('vi-VN')}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Phone className="w-3.5 h-3.5" />
                                    {booking.user?.phone || 'Chưa để lại số'}
                                  </span>
                                </div>
                                {booking.message && (
                                  <div className="mt-3 p-3 bg-gray-50 rounded-xl text-xs text-gray-600 italic">
                                    "{booking.message}"
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end gap-3">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(booking.status)}`}>
                                {getStatusText(booking.status)}
                              </span>
                              
                              {booking.status === 'pending' && (
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleUpdateBooking(booking._id, 'confirmed')}
                                    className="bg-green-600 hover:bg-green-700 text-white rounded-xl h-9 px-4 text-xs"
                                  >
                                    <Check className="w-3.5 h-3.5 mr-1" /> Chấp nhận
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleUpdateBooking(booking._id, 'cancelled')}
                                    className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl h-9 px-4 text-xs"
                                  >
                                    <X className="w-3.5 h-3.5 mr-1" /> Từ chối
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <Bell className="w-8 h-8 text-gray-300" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-700">Chưa có yêu cầu nào</h4>
                      <p className="text-gray-500 mt-1">Khi có người muốn thuê phòng của bạn, yêu cầu sẽ xuất hiện ở đây.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'bookings' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <h3 className="text-xl font-bold text-[#021f29] mb-6 flex items-center gap-2">
                    <div className="w-2 h-6 bg-[#FFA726] rounded-full" />
                    Lịch sử đặt phòng
                  </h3>

                  {bookingsLoading ? (
                    <div className="flex items-center justify-center py-20">
                      <Loader2 className="w-10 h-10 text-[#1565C0] animate-spin" />
                    </div>
                  ) : myBookings.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {myBookings.map(booking => (
                        <div key={booking._id} className="p-5 bg-white border border-gray-100 rounded-3xl hover:border-blue-200 transition-all shadow-sm flex gap-6">
                          <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                            <img 
                              src={booking.property?.images?.[0] || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af'} 
                              alt="" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between">
                                <h4 className="font-bold text-[#021f29] line-clamp-1">{booking.property?.title}</h4>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(booking.status)}`}>
                                  {getStatusText(booking.status)}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {booking.property?.address}
                              </p>
                              <p className="text-xs text-gray-400 mt-3 font-medium">
                                Ngày dự kiến dời vào: <span className="text-gray-700">{new Date(booking.checkInDate).toLocaleDateString('vi-VN')}</span>
                              </p>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                              <span className="text-sm font-bold text-[#1565C0]">
                                {booking.property?.price?.toLocaleString()} đ<span className="text-[10px] text-gray-400 font-normal">/tháng</span>
                              </span>
                              <div className="flex items-center gap-3">
                                {['confirmed', 'completed'].includes(booking.status) && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => navigate(`/property/${booking.property?._id}`)}
                                    className="border-amber-200 text-amber-600 hover:bg-amber-50 rounded-xl h-8 px-3 text-[10px] font-bold"
                                  >
                                    <Star className="w-3 h-3 mr-1 fill-current" /> Đánh giá
                                  </Button>
                                )}
                                <Link 
                                  to={`/property/${booking.property?._id}`}
                                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                                >
                                  Xem chi tiết <ChevronRight className="w-3 h-3" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <Calendar className="w-8 h-8 text-gray-300" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-700">Bạn chưa đặt phòng nào</h4>
                      <p className="text-gray-500 mt-1">Tìm kiếm phòng trọ ưng ý và gửi yêu cầu ngay nhé!</p>
                      <Button 
                        onClick={() => navigate('/properties')}
                        variant="link"
                        className="text-[#1565C0] font-bold mt-4"
                      >
                        Khám phá ngay
                      </Button>
                    </div>
                  )}
                </div>
              )}


              {activeTab === 'settings' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                   <h3 className="text-xl font-bold text-[#021f29] mb-6 flex items-center gap-2">
                      <div className="w-2 h-6 bg-[#FFA726] rounded-full" />
                      Bảo mật tài khoản
                    </h3>
                    <div className="space-y-4">
                       <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                                <Shield className="w-5 h-5" />
                             </div>
                             <div>
                                <p className="font-bold text-gray-700 text-sm">Đổi mật khẩu</p>
                                <p className="text-xs text-gray-400">Thay đổi mật khẩu định kỳ để bảo vệ tài khoản</p>
                             </div>
                          </div>
                          <Edit3 className="w-4 h-4 text-gray-400" />
                       </div>
                       
                       <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#1565C0]">
                                <Bell className="w-5 h-5" />
                             </div>
                             <div>
                                <p className="font-bold text-gray-700 text-sm">Thông báo</p>
                                <p className="text-xs text-gray-400">Quản lý các loại thông báo bạn nhận được</p>
                             </div>
                          </div>
                          <Settings className="w-4 h-4 text-gray-400" />
                       </div>

                       <div 
                        onClick={handleDeleteAccount}
                        className="flex items-center justify-between p-4 border border-red-50 rounded-2xl hover:bg-red-50/50 transition-all cursor-pointer group"
                       >
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                                <XCircle className="w-5 h-5" />
                             </div>
                             <div>
                                <p className="font-bold text-red-600 text-sm">Xóa tài khoản</p>
                                <p className="text-xs text-red-400">Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn</p>
                             </div>
                          </div>
                       </div>
                    </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
