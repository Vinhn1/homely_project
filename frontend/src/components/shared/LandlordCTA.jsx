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

        {/* CTA Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#1565C0] to-[#0d47a1] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          {/* Image */}
          <div className="relative shrink-0 w-full md:w-72 h-52 rounded-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&auto=format&fit=crop&q=80"
              alt="Chủ nhà"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Content */}
          <div className="relative text-white">
            <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">Dành cho chủ nhà</span>
            <h2 className="text-2xl md:text-3xl font-bold mt-3 mb-3" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
              Trở thành Chủ nhà uy tín
            </h2>
            <p className="text-blue-100 text-sm leading-relaxed mb-6 max-w-md">
              Đăng tin nhanh chóng, tiếp cận hàng ngàn người thuê tiềm năng mỗi ngày. Tận hưởng đặc quyền hiển thị ưu tiên dành cho thành viên Premium.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/register">
                <Button className="bg-[#FFA726] hover:bg-[#FB8C00] text-white font-semibold gap-2">
                  <ArrowUp className="w-4 h-4" />
                  Đăng ký Premium ngay
                </Button>
              </Link>
              <Link to="/huong-dan">
                <Button variant="ghost" className="text-white hover:bg-white/10 border border-white/30">
                  Tìm hiểu thêm →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
