import { Link } from 'react-router-dom'
import { MapPin, ArrowRight } from 'lucide-react'

const CITIES = [
  {
    id: 'hcm',
    name: 'Hồ Chí Minh',
    listings: '18,540',
    desc: 'Thành phố năng động nhất Việt Nam',
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'hn',
    name: 'Hà Nội',
    listings: '12,280',
    desc: 'Thủ đô ngàn năm văn hiến',
    image: 'https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'dn',
    name: 'Đà Nẵng',
    listings: '5,190',
    desc: 'Thành phố đáng sống nhất miền Trung',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'ct',
    name: 'Cần Thơ',
    listings: '2,870',
    desc: 'Thành phố miền Tây sông nước',
    image: 'https://images.unsplash.com/photo-1572641255661-9b1a7ead7b9d?w=600&auto=format&fit=crop&q=80',
  },
]

export default function CitySection() {
  const [featured, ...rest] = CITIES

  return (
    <section className="py-20 bg-[#f3faff]">
      <div className="max-w-[1280px] mx-auto px-6">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-[#FFA726] font-semibold text-sm uppercase tracking-widest mb-2 block">
              📍 Địa điểm nổi bật
            </span>
            <h2 className="text-3xl font-bold text-[#021f29]"
              style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
              Khám phá theo thành phố
            </h2>
            <p className="text-gray-500 mt-1">Hàng nghìn phòng trọ tại các thành phố lớn.</p>
          </div>
          <Link
            to="/tim-phong"
            className="hidden md:flex items-center gap-1.5 text-[#1565C0] font-medium hover:gap-3 transition-all text-sm"
          >
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid layout */}
        <div className="flex gap-4" style={{ height: '440px' }}>

          {/* Featured card — left, full height */}
          <Link
            to={`/tim-phong?city=${featured.id}`}
            className="relative flex-[2] rounded-3xl overflow-hidden group block min-w-0"
          >
            <img
              src={featured.image}
              alt={featured.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Badge */}
            <div className="absolute top-4 left-4">
              <span className="bg-[#FFA726] text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                🔥 Phổ biến nhất
              </span>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-white font-bold text-2xl leading-tight mb-1">
                {featured.name}
              </h3>
              <p className="text-blue-100 text-sm mb-3">{featured.desc}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FFA726]" />
                  <span className="text-white/90 text-sm font-medium">{featured.listings} tin đăng</span>
                </div>
                <span className="text-white/70 text-xs bg-white/10 px-3 py-1 rounded-full group-hover:bg-white/20 transition-colors">
                  Khám phá →
                </span>
              </div>
            </div>
          </Link>

          {/* Right column — 3 small cards stacked */}
          <div className="flex-[1] flex flex-col gap-4 min-w-0">
            {rest.map((city) => (
              <Link
                key={city.id}
                to={`/tim-phong?city=${city.id}`}
                className="relative flex-1 rounded-2xl overflow-hidden group block"
              >
                <img
                  src={city.image}
                  alt={city.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#1565C0]/0 group-hover:bg-[#1565C0]/20 transition-colors duration-300" />

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-base leading-tight">{city.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-[#FFA726]" />
                    <span className="text-white/80 text-xs">{city.listings} tin đăng</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>

        {/* Mobile "View all" */}
        <div className="mt-6 text-center md:hidden">
          <Link
            to="/tim-phong"
            className="inline-flex items-center gap-2 text-[#1565C0] font-medium text-sm"
          >
            Xem tất cả thành phố <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  )
}
