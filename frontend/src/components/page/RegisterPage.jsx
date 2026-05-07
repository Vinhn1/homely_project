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
