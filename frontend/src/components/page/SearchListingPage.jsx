import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  MapPin, 
  Home, 
  DollarSign, 
  Maximize2, 
  ChevronDown, 
  X,
  Loader2,
  SlidersHorizontal
} from 'lucide-react'
import { usePropertyStore } from '@/store/usePropertyStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import PropertyCard from '@/components/shared/PropertyCard'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'

export default function SearchListingPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { 
    properties, 
    categories, 
    districts, 
    fetchProperties, 
    fetchMetadata, 
    loading 
  } = usePropertyStore()

  // Local filter state
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || '',
    district: searchParams.get('district') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minArea: searchParams.get('minArea') || '',
  })

  const [showMobileFilters, setShowMobileFilters] = useState(false)

  useEffect(() => {
    fetchMetadata()
  }, [fetchMetadata])

  const handleFetch = useCallback(() => {
    const params = {}
    if (filters.keyword) params.keyword = filters.keyword
    if (filters.category) params.category = filters.category
    if (filters.district) params.district = filters.district
    if (filters.minPrice) params.minPrice = filters.minPrice
    if (filters.maxPrice) params.maxPrice = filters.maxPrice
    if (filters.minArea) params.minArea = filters.minArea
    
    fetchProperties(params)
    setSearchParams(params)
  }, [filters, fetchProperties, setSearchParams])

  useEffect(() => {
    handleFetch()
  }, [handleFetch])

  const updateFilter = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const clearFilters = () => {
    const cleared = {
      keyword: '',
      category: '',
      district: '',
      minPrice: '',
      maxPrice: '',
      minArea: '',
    }
    setFilters(cleared)
    fetchProperties({})
    setSearchParams({})
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />

      {/* Header Section */}
      <div className="bg-[#1565C0] pt-12 pb-24 px-6 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>

        <div className="max-w-[1400px] mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
            Tìm kiếm <span className="text-blue-200">không gian</span> lý tưởng
          </h1>
          <p className="text-blue-100 max-w-2xl mx-auto text-lg font-medium opacity-90">
            Hơn 1,000+ tin đăng chất lượng tại Vĩnh Long đang chờ đón bạn khám phá.
          </p>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-6 -mt-12 relative z-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block space-y-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-blue-900/5 border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-xl text-[#021f29] flex items-center gap-2">
                  <Filter className="w-5 h-5 text-[#1565C0]" /> Bộ lọc
                </h3>
                <button 
                  onClick={clearFilters}
                  className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-wider"
                >
                  Xóa tất cả
                </button>
              </div>

              <div className="space-y-8">
                {/* Keyword */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Từ khóa</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                      placeholder="Tên đường, khu vực..." 
                      className="pl-11 h-12 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all"
                      value={filters.keyword}
                      onChange={(e) => updateFilter('keyword', e.target.value)}
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Loại hình</label>
                  <div className="relative">
                    <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select 
                      className="w-full pl-11 pr-4 h-12 rounded-xl border-2 border-gray-100 bg-gray-50/50 focus:bg-white focus:border-[#1565C0] outline-none appearance-none transition-all text-sm font-medium text-gray-700"
                      value={filters.category}
                      onChange={(e) => updateFilter('category', e.target.value)}
                    >
                      <option value="">Tất cả loại hình</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* District */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Khu vực (Vĩnh Long)</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select 
                      className="w-full pl-11 pr-4 h-12 rounded-xl border-2 border-gray-100 bg-gray-50/50 focus:bg-white focus:border-[#1565C0] outline-none appearance-none transition-all text-sm font-medium text-gray-700"
                      value={filters.district}
                      onChange={(e) => updateFilter('district', e.target.value)}
                    >
                      <option value="">Tất cả Quận/Huyện</option>
                      {districts.map(dist => (
                        <option key={dist._id} value={dist._id}>{dist.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Giá thuê tối đa</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select 
                      className="w-full pl-11 pr-4 h-12 rounded-xl border-2 border-gray-100 bg-gray-50/50 focus:bg-white focus:border-[#1565C0] outline-none appearance-none transition-all text-sm font-medium text-gray-700"
                      value={filters.maxPrice}
                      onChange={(e) => updateFilter('maxPrice', e.target.value)}
                    >
                      <option value="">Không giới hạn</option>
                      <option value="1000000">Dưới 1 triệu</option>
                      <option value="2000000">Dưới 2 triệu</option>
                      <option value="3000000">Dưới 3 triệu</option>
                      <option value="5000000">Dưới 5 triệu</option>
                      <option value="10000000">Dưới 10 triệu</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Area Range */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Diện tích tối thiểu (m²)</label>
                  <div className="relative">
                    <Maximize2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                      type="number"
                      placeholder="VD: 20" 
                      className="pl-11 h-12 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all"
                      value={filters.minArea}
                      onChange={(e) => updateFilter('minArea', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleFetch}
                className="w-full mt-10 h-14 rounded-2xl bg-[#1565C0] hover:bg-[#0d47a1] text-white font-bold shadow-lg shadow-blue-900/10 transition-all active:scale-95"
              >
                Áp dụng lọc
              </Button>
            </div>

            {/* Helper Card */}
            <div className="bg-gradient-to-br from-[#1565C0] to-[#0d47a1] rounded-[2rem] p-8 text-white shadow-xl shadow-blue-900/20">
              <h4 className="font-bold text-lg mb-2">Bạn cần hỗ trợ?</h4>
              <p className="text-blue-100 text-sm mb-6 opacity-80 leading-relaxed">Đội ngũ của Homely luôn sẵn sàng giúp bạn tìm được căn phòng ưng ý nhất.</p>
              <Button variant="outline" className="w-full bg-white/10 border-white/20 hover:bg-white text-white hover:text-[#1565C0] font-bold rounded-xl transition-all">
                Gửi yêu cầu
              </Button>
            </div>
          </aside>

          {/* Results Area */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Top bar results info */}
            <div className="bg-white rounded-2xl p-4 px-6 flex flex-wrap items-center justify-between gap-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <span className="font-bold text-[#021f29]">Tìm thấy {properties.length} kết quả</span>
                {Object.values(filters).some(v => v !== '') && (
                  <div className="hidden md:flex gap-2">
                    <div className="w-[1px] h-4 bg-gray-200 mx-1"></div>
                    <span className="text-xs text-gray-400 font-medium italic">Đang áp dụng bộ lọc</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="lg:hidden rounded-xl border-gray-200 font-bold gap-2"
                  onClick={() => setShowMobileFilters(true)}
                >
                  <SlidersHorizontal className="w-4 h-4" /> Lọc
                </Button>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest hidden sm:block">Sắp xếp:</span>
                  <select className="text-sm font-bold text-[#1565C0] bg-transparent outline-none cursor-pointer">
                    <option>Mới nhất</option>
                    <option>Giá thấp đến cao</option>
                    <option>Giá cao đến thấp</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-40 gap-4 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                <Loader2 className="w-12 h-12 text-[#1565C0] animate-spin" />
                <p className="text-gray-400 font-medium">Đang tìm kiếm tin đăng phù hợp...</p>
              </div>
            ) : properties.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 gap-6 bg-white rounded-[2rem] border border-gray-100 shadow-sm text-center px-6">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                  <Search className="w-12 h-12" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900">Không tìm thấy tin đăng nào</h3>
                  <p className="text-gray-500 max-w-md mx-auto">Chúng tôi không tìm thấy kết quả phù hợp với bộ lọc của bạn. Hãy thử thay đổi tiêu chí tìm kiếm hoặc xóa bộ lọc.</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="rounded-xl border-2 border-gray-200 font-bold hover:bg-gray-50"
                >
                  Xóa tất cả bộ lọc
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map(property => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            )}

            {/* Pagination Placeholder */}
            {properties.length > 0 && (
              <div className="flex justify-center pt-10">
                <div className="flex gap-2">
                  <Button variant="outline" className="w-10 h-10 p-0 rounded-xl border-gray-200 font-bold" disabled>1</Button>
                  <Button variant="ghost" className="w-10 h-10 p-0 rounded-xl font-bold">2</Button>
                  <Button variant="ghost" className="w-10 h-10 p-0 rounded-xl font-bold">3</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filters Drawer Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)}></div>
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] p-8 space-y-6 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-black text-2xl text-[#021f29]">Bộ lọc tìm kiếm</h3>
              <button onClick={() => setShowMobileFilters(false)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Reuse the filter inputs here if needed or separate into component */}
              {/* For brevity, I'll just show the Category & Price for mobile */}
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Loại hình</label>
                <select 
                  className="w-full px-4 h-14 rounded-2xl border-2 border-gray-100 bg-gray-50 text-sm font-bold"
                  value={filters.category}
                  onChange={(e) => updateFilter('category', e.target.value)}
                >
                  <option value="">Tất cả loại hình</option>
                  {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Giá thuê tối đa</label>
                <select 
                  className="w-full px-4 h-14 rounded-2xl border-2 border-gray-100 bg-gray-50 text-sm font-bold"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilter('maxPrice', e.target.value)}
                >
                  <option value="">Không giới hạn</option>
                  <option value="1000000">Dưới 1 triệu</option>
                  <option value="2000000">Dưới 2 triệu</option>
                  <option value="5000000">Dưới 5 triệu</option>
                </select>
              </div>

              <Button 
                onClick={() => { handleFetch(); setShowMobileFilters(false); }}
                className="w-full h-14 rounded-2xl bg-[#1565C0] text-white font-bold shadow-xl"
              >
                Xem {properties.length} kết quả
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
