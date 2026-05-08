import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, User, Mail, Lock, Phone, ArrowRight, Building2, Search } from 'lucide-react'

const BENEFITS = {
  tenant: [
    { icon: '🔍', text: 'Tìm kiếm thông minh theo nhu cầu' },
    { icon: '✅', text: 'Tin đăng đã xác minh chất lượng' },
    { icon: '💬', text: 'Chat trực tiếp với chủ nhà' },
  ],
  landlord: [
    { icon: '📢', text: 'Đăng tin miễn phí, tiếp cận ngay' },
    { icon: '📊', text: 'Quản lý phòng trọ dễ dàng' },
    { icon: '💰', text: 'Thu tiền thuê trực tuyến an toàn' },
  ],
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [role, setRole] = useState('tenant')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '',
  })
  const navigate = useNavigate()

  const handleChange = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); navigate('/login') }, 1000)
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col">
        <img
          src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=85"
          alt="TroTot"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#003a8c]/90 via-[#1565C0]/85 to-[#0d3d6e]/90" />

        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 w-fit">
            <div className="w-10 h-10 bg-[#FFA726] rounded-xl flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </div>
            <span className="text-white text-2xl font-bold tracking-tight">TroTốt</span>
          </Link>

          {/* Role-specific content */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-2">
              <span className="inline-block bg-[#FFA726]/20 text-[#FFA726] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#FFA726]/30 mb-5">
                {role === 'tenant' ? '🔍 Dành cho người tìm phòng' : '🏠 Dành cho chủ nhà'}
              </span>
            </div>
            <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-3">
              {role === 'tenant' ? (
                <>Tìm phòng trọ<br /><span className="text-[#FFA726]">nhanh & tin cậy</span></>
              ) : (
                <>Cho thuê phòng<br /><span className="text-[#FFA726]">hiệu quả hơn</ span></>
              )}
            </h2>
            <p className="text-blue-100 text-base leading-relaxed mb-8 max-w-xs">
              {role === 'tenant'
                ? 'Hàng nghìn phòng trọ, căn hộ đã xác minh tại các thành phố lớn Việt Nam.'
                : 'Đăng tin, quản lý và thu tiền thuê — tất cả trên một nền tảng.'}
            </p>

            {/* Benefits */}
            <ul className="space-y-4">
              {BENEFITS[role].map((b) => (
                <li key={b.text} className="flex items-center gap-3 group">
                  <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-lg group-hover:bg-[#FFA726]/20 transition-colors">
                    {b.icon}
                  </div>
                  <span className="text-blue-100 text-sm">{b.text}</span>
                </li>
              ))}
            </ul>

            {/* Stats */}
            <div className="flex gap-6 mt-10 pt-8 border-t border-white/10">
              <div>
                <p className="text-2xl font-bold text-white">50k+</p>
                <p className="text-blue-200 text-xs mt-0.5">Phòng đã đăng</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">120k+</p>
                <p className="text-blue-200 text-xs mt-0.5">Người dùng</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">98%</p>
                <p className="text-blue-200 text-xs mt-0.5">Hài lòng</p>
              </div>
            </div>
          </div>

          <p className="text-blue-200/50 text-xs">© 2024 TroTốt</p>
        </div>
      </div>

      {/* ── Right Panel – Form ── */}
      <div className="flex-1 flex items-center justify-center bg-[#f3faff] p-6 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-[440px] py-6">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-[#1565C0] rounded-xl flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </div>
            <span className="text-[#1565C0] text-xl font-bold">TroTốt</span>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-[#021f29] mb-1">Tạo tài khoản</h2>
            <p className="text-gray-500 text-sm">Tham gia nền tảng thuê phòng tin cậy</p>
          </div>

          {/* Role Toggle */}
          <div className="flex gap-3 mb-6">
            <button
              type="button"
              onClick={() => setRole('tenant')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${
                role === 'tenant'
                  ? 'bg-[#1565C0] border-[#1565C0] text-white shadow-md shadow-[#1565C0]/30'
                  : 'bg-white border-gray-200 text-gray-500 hover:border-[#1565C0]/40'
              }`}
            >
              <Search className="w-4 h-4" />
              Tìm phòng
            </button>
            <button
              type="button"
              onClick={() => setRole('landlord')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${
                role === 'landlord'
                  ? 'bg-[#1565C0] border-[#1565C0] text-white shadow-md shadow-[#1565C0]/30'
                  : 'bg-white border-gray-200 text-gray-500 hover:border-[#1565C0]/40'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Chủ nhà
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">

            {/* Full Name */}
            <div>
              <label htmlFor="reg-name" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Họ và tên
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="reg-name"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={form.fullName}
                  onChange={handleChange('fullName')}
                  required
                  className="w-full h-12 pl-11 pr-4 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/10 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="reg-email"
                  type="email"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={handleChange('email')}
                  required
                  className="w-full h-12 pl-11 pr-4 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/10 transition-all"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="reg-phone" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Số điện thoại <span className="text-gray-400 normal-case font-normal">(tuỳ chọn)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="reg-phone"
                  type="tel"
                  placeholder="0912 345 678"
                  value={form.phone}
                  onChange={handleChange('phone')}
                  className="w-full h-12 pl-11 pr-4 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/10 transition-all"
                />
              </div>
            </div>

            {/* Password row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="reg-password" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Tối thiểu 8 ký tự"
                    value={form.password}
                    onChange={handleChange('password')}
                    required minLength={8}
                    className="w-full h-12 pl-10 pr-10 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/10 transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="reg-confirm" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Xác nhận
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="reg-confirm"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Nhập lại"
                    value={form.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    required
                    className="w-full h-12 pl-10 pr-10 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/10 transition-all"
                  />
                  <button type="button" onClick={() => setShowConfirm(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms */}
            <p className="text-xs text-gray-400 leading-relaxed">
              Bằng cách đăng ký, bạn đồng ý với{' '}
              <Link to="/dieu-khoan" className="text-[#1565C0] hover:underline">Điều khoản dịch vụ</Link>
              {' '}và{' '}
              <Link to="/bao-mat" className="text-[#1565C0] hover:underline">Chính sách bảo mật</Link>
              {' '}của TroTốt.
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#FFA726] hover:bg-[#f59000] disabled:opacity-70 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-md shadow-[#FFA726]/30 hover:shadow-lg hover:shadow-[#FFA726]/40 hover:-translate-y-0.5 mt-1"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Tạo tài khoản miễn phí <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-xs font-medium">hoặc đăng ký với</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="h-11 bg-white border border-gray-200 rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:border-gray-300 hover:shadow-sm transition-all active:scale-95"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button
              type="button"
              className="h-11 bg-white border border-gray-200 rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:border-gray-300 hover:shadow-sm transition-all active:scale-95"
            >
              <svg viewBox="0 0 24 24" fill="#1877F2" className="w-4 h-4">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div>

          {/* Login link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-[#1565C0] font-semibold hover:underline">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
