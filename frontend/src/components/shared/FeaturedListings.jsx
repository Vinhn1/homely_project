import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Star, Heart, ArrowRight, Maximize2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { usePropertyStore } from '@/store/usePropertyStore'

import PropertyCard from './PropertyCard'

export default function FeaturedListings() {
  const { properties, fetchProperties, loading } = usePropertyStore();

  useEffect(() => {
    fetchProperties({ limit: 6 });
  }, [fetchProperties]);

  return (
    <section className="py-20 bg-gray-50/50">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-2">
            <div className="inline-block px-3 py-1 bg-blue-100 text-[#1565C0] text-[10px] font-bold rounded-full uppercase tracking-widest mb-2">
              Khám phá ngay
            </div>
            <h2 className="text-4xl font-black text-[#021f29] tracking-tight" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
              Tin đăng <span className="text-[#1565C0]">nổi bật</span>
            </h2>
            <p className="text-gray-500 max-w-md">Những phòng trọ, căn hộ chất lượng cao vừa được cập nhật tại khu vực Vĩnh Long.</p>
          </div>
          <Link to="/tim-phong">
            <Button variant="ghost" className="text-[#1565C0] hover:bg-blue-100/50 font-bold gap-2 text-sm">
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-[#1565C0] animate-spin" />
            <p className="text-gray-400 font-medium">Đang tải danh sách tin đăng...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <p className="text-gray-400">Hiện chưa có tin đăng nào được hiển thị.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {properties.map(property => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
