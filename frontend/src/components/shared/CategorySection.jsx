import { useState } from 'react'
import { BedDouble, Building2, Home, Users } from 'lucide-react'

const CATEGORIES = [
  { id: 'phong-tro', label: 'Phòng trọ', count: '12,540', Icon: BedDouble, color: 'blue' },
  { id: 'can-ho', label: 'Căn hộ', count: '8,120', Icon: Building2, color: 'sky' },
  { id: 'nha-nguyen-can', label: 'Nhà nguyên căn', count: '3,890', Icon: Home, color: 'amber' },
  { id: 'o-ghep', label: 'Ở ghép', count: '2,340', Icon: Users, color: 'teal' },
]

const COLOR_MAP = {
  blue:  { bg: 'bg-blue-50',   icon: 'bg-[#1565C0] text-white',  border: 'border-[#1565C0]', text: 'text-[#1565C0]' },
  sky:   { bg: 'bg-sky-50',    icon: 'bg-sky-500 text-white',     border: 'border-sky-500',   text: 'text-sky-600' },
  amber: { bg: 'bg-amber-50',  icon: 'bg-[#FFA726] text-white',   border: 'border-[#FFA726]', text: 'text-amber-600' },
  teal:  { bg: 'bg-teal-50',   icon: 'bg-teal-500 text-white',    border: 'border-teal-500',  text: 'text-teal-600' },
}

export default function CategorySection() {
  const [active, setActive] = useState('phong-tro')

  return (
    <section className="py-16 bg-[#f3faff]">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#021f29] mb-2" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
            Khám phá theo loại hình
          </h2>
          <p className="text-gray-500">Tìm không gian sống phù hợp với nhu cầu của bạn</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map(({ id, label, count, Icon, color }) => {
            const c = COLOR_MAP[color]
            const isActive = active === id
            return (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`
                  flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer
                  ${isActive ? `${c.bg} ${c.border} shadow-md` : 'bg-white border-transparent hover:shadow-md hover:border-gray-200'}
                `}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${c.icon}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <div className="text-center">
                  <p className={`font-semibold text-base ${isActive ? c.text : 'text-gray-700'}`}>{label}</p>
                  <p className="text-xs text-gray-400 mt-1">{count} tin đăng</p>
                </div>
                {isActive && (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.bg} ${c.text} border ${c.border}`}>
                    Đang xem
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
