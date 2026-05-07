import { Star, Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const TESTIMONIALS = [
  {
    id: 1, name: 'Minh Tuấn',
    location: 'Đã thuê tại Quận Bình Thạnh, HCM',
    avatar: 'https://i.pravatar.cc/80?img=11', rating: 5,
    text: 'Khu vực này an ninh rất tốt, gần nhiều trường đại học và chợ. Nhờ TroTot mình tìm được phòng ưng ý rất nhanh chóng, chủ nhà thân thiện.',
  },
  {
    id: 2, name: 'Hoàng Oanh',
    location: 'Đã thuê tại Quận Cầu Giấy, HN',
    avatar: 'https://i.pravatar.cc/80?img=5', rating: 5,
    text: 'Căn hộ mini sạch sẽ, đúng như hình ảnh xác minh trên web. Rất tiện lợi khi có thể chat trực tiếp với chủ nhà trước khi đến xem.',
  },
  {
    id: 3, name: 'Thanh Tùng',
    location: 'Đã thuê tại Quận Hải Châu, ĐN',
    avatar: 'https://i.pravatar.cc/80?img=15', rating: 5,
    text: 'Giao diện dễ dùng, tính năng lọc theo khoảng giá và khu vực rất chính xác. Tôi đánh giá cao độ uy tín của các tin đăng có mác "Xác minh".',
  },
]

function Stars({ n }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < n ? 'fill-[#FFA726] text-[#FFA726]' : 'fill-gray-200 text-gray-200'}`} />
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold text-[#1565C0] uppercase tracking-widest">Cộng đồng chia sẻ</span>
          <h2 className="text-3xl font-bold text-[#021f29] mt-2 mb-2" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
            Người dùng nói gì về TroTot?
          </h2>
          <p className="text-gray-500">Đánh giá thực tế từ những người đã thuê phòng qua TroTot.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(t => (
            <Card key={t.id} className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-md transition-shadow rounded-2xl">
              <CardContent className="p-6">
                <Quote className="w-8 h-8 text-[#1565C0]/20 mb-3" />
                <Stars n={t.rating} />
                <p className="text-gray-600 text-sm leading-relaxed mt-3 mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-sm text-[#021f29]">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
