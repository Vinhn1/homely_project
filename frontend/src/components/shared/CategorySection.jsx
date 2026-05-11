import { useEffect } from 'react'
import * as LucideIcons from 'lucide-react'
import { usePropertyStore } from '@/store/usePropertyStore'

const COLOR_MAP = [
  { bg: 'bg-blue-50',   icon: 'bg-[#1565C0] text-white',  border: 'border-[#1565C0]', text: 'text-[#1565C0]' },
  { bg: 'bg-sky-50',    icon: 'bg-sky-500 text-white',     border: 'border-sky-500',   text: 'text-sky-600' },
  { bg: 'bg-amber-50',  icon: 'bg-[#FFA726] text-white',   border: 'border-[#FFA726]', text: 'text-amber-600' },
  { bg: 'bg-teal-50',   icon: 'bg-teal-500 text-white',    border: 'border-teal-500',  text: 'text-teal-600' },
]

export default function CategorySection() {
  const { categories, fetchMetadata, loading } = usePropertyStore();

  useEffect(() => {
    if (categories.length === 0) {
      fetchMetadata();
    }
  }, [categories.length, fetchMetadata]);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center mb-14">
          <div className="inline-block px-3 py-1 bg-blue-50 text-[#1565C0] text-[10px] font-bold rounded-full uppercase tracking-widest mb-3">
            Danh mục đa dạng
          </div>
          <h2 className="text-4xl font-black text-[#021f29] tracking-tight" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
            Khám phá theo <span className="text-[#1565C0]">loại hình</span>
          </h2>
          <p className="text-gray-500 mt-2 max-w-md mx-auto">Tìm kiếm không gian sống phù hợp nhất với nhu cầu và phong cách của bạn.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {loading && categories.length === 0 ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-44 rounded-3xl bg-gray-100 animate-pulse"></div>
            ))
          ) : (
            categories.map((category, index) => {
              const c = COLOR_MAP[index % COLOR_MAP.length]
              // Lấy icon từ lucide-react hoặc fallback sang Home
              const IconComponent = LucideIcons[category.icon] || LucideIcons.Home
              
              return (
                <div
                  key={category._id}
                  className="group flex flex-col items-center gap-5 p-8 rounded-[2rem] border-2 border-transparent bg-gray-50 hover:bg-white hover:border-gray-100 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300 cursor-pointer text-center"
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ${c.icon}`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-gray-800 group-hover:text-[#1565C0] transition-colors">{category.name}</p>
                    <p className="text-xs text-gray-400 mt-1 font-medium">{category.description || 'Nhiều lựa chọn tốt'}</p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}
