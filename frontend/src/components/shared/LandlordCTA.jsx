import { Link } from 'react-router-dom'
import { Shield, MessageCircle, Headphones, ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

const STATS = [
  { value: '50K+', label: 'Tin đăng cho thuê' },
  { value: '1M+', label: 'Người dùng tích cực' },
  { value: '63', label: 'Tỉnh thành phủ sóng' },
  { value: '4.8★', label: 'Đánh giá hài lòng' },
]

const FEATURES = [
  { Icon: Shield, title: 'Tin đăng xác thực', desc: 'Mọi tin đăng được kiểm duyệt kỹ lưỡng, loại bỏ tin giả, đảm bảo thông tin chính xác và an toàn tuyệt đối.' },
  { Icon: MessageCircle, title: 'Liên hệ trực tiếp', desc: 'Không qua môi giới, kết nối trực tiếp với chủ nhà để thương lượng giá và điều khoản minh bạch.' },
  { Icon: Headphones, title: 'Hỗ trợ 24/7', desc: 'Đội ngũ chăm sóc khách hàng tận tâm luôn sẵn sàng hỗ trợ bạn trong suốt quá trình tìm kiếm.' },
]

export default function LandlordCTA() {
  return (
    <section className="bg-[#f3faff] py-16">
      <div className="max-w-[1280px] mx-auto px-6">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {STATS.map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-6 text-center shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
              <p className="text-3xl font-bold text-[#1565C0] mb-1" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {FEATURES.map(({ Icon, title, desc }) => (
            <div key={title} className="flex gap-4 bg-white p-6 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6 text-[#1565C0]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#021f29] mb-1">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner - Premium Design */}
        <div className="relative overflow-hidden bg-[#1565C0] rounded-3xl p-10 md:p-14 flex items-center justify-between gap-10">
          {/* Content */}
          <div className="relative z-10 flex-1">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
              Trở thành Chủ nhà uy tín
            </h2>
            <p className="text-blue-100 text-sm md:text-base leading-relaxed mb-8 max-w-2xl">
              Đăng tin nhanh chóng, tiếp cận hàng ngàn người thuê tiềm năng mỗi ngày.<br className="hidden md:block" />
              Tận hưởng các đặc quyền hiển thị ưu tiên dành riêng cho thành viên Premium.
            </p>
            <Link to="/register">
              <button className="bg-[#FFA726] hover:bg-[#FB8C00] text-[#021f29] px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
                Đăng ký Premium ngay
              </button>
            </Link>
          </div>

          {/* Icon Section (Right) */}
          <div className="hidden md:flex relative shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
              <div className="w-16 h-16 md:w-20 md:h-20 text-[#FFA726]">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-lg">
                  <path d="M6 3L3 8L12 22L21 8L18 3H6Z" />
                  <path d="M6 3L12 8L18 3H6Z" fill="white" fillOpacity="0.2" />
                  <path d="M3 8L12 8L12 22L3 8Z" fill="white" fillOpacity="0.1" />
                </svg>
              </div>
            </div>
            {/* Soft Glow */}
            <div className="absolute inset-0 bg-[#FFA726]/10 blur-3xl rounded-full" />
          </div>
        </div>
      </div>
    </section>
  )
}
