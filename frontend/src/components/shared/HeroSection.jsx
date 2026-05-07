import { useState } from 'react'
import { Search, MapPin, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const CITIES = ['Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Biên Hòa']
const TYPES = ['Phòng trọ', 'Căn hộ', 'Nhà nguyên căn', 'Ở ghép']
const QUICK_TAGS = ['Quận 1', 'Quận 7', 'Bình Thạnh', 'Cầu Giấy', 'Hoàn Kiếm']

export default function HeroSection() {
  const [keyword, setKeyword] = useState('')
  const [city, setCity] = useState('')
  const [type, setType] = useState('')

  return (
    <section className="relative min-h-[580px] flex items-center">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600&auto=format&fit=crop&q=80"
          alt="hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20" />
      </div>

      <div className="relative max-w-[1280px] mx-auto px-6 py-20 w-full">
        {/* Text */}
        <div className="max-w-2xl mb-10">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 backdrop-blur-sm">
            Nền tảng thuê phòng #1 Việt Nam
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
            Tìm Không Gian Sống<br />
            <span className="text-[#FFA726]">Ưng Ý Của Bạn</span>
          </h1>
          <p className="text-blue-100 text-lg">
            Hàng nghìn phòng trọ, căn hộ và nhà cho thuê được xác minh chất lượng trên toàn quốc.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-5 max-w-3xl">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Keyword */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="hero-keyword"
                placeholder="Tìm theo tên phòng, địa chỉ..."
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                className="pl-9 border-gray-200 focus:border-[#1565C0] h-11"
              />
            </div>

            {/* City */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                id="hero-city"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="pl-9 pr-4 h-11 border border-gray-200 rounded-md text-sm bg-white focus:outline-none focus:border-[#1565C0] appearance-none min-w-[160px]"
              >
                <option value="">Tất cả thành phố</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Type */}
            <div className="relative">
              <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                id="hero-type"
                value={type}
                onChange={e => setType(e.target.value)}
                className="pl-9 pr-4 h-11 border border-gray-200 rounded-md text-sm bg-white focus:outline-none focus:border-[#1565C0] appearance-none min-w-[150px]"
              >
                <option value="">Loại phòng</option>
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Button */}
            <Button
              className="bg-[#FFA726] hover:bg-[#FB8C00] text-white font-semibold h-11 px-6 gap-2 shrink-0"
              onClick={() => console.log({ keyword, city, type })}
            >
              <Search className="w-4 h-4" />
              Tìm kiếm
            </Button>
          </div>

          {/* Quick tags */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-xs text-gray-500">Phổ biến:</span>
            {QUICK_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => setKeyword(tag)}
                className="text-xs bg-blue-50 text-[#1565C0] hover:bg-blue-100 px-3 py-1 rounded-full transition-colors font-medium"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
