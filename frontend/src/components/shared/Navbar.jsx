import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, Home, LogOut, User as UserIcon, Search, MapPin, Heart, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/useAuthStore'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { isAuthenticated, user, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  // Hàm xử lý các hành động yêu cầu đăng nhập
  const handleProtectedAction = (path) => {
    if (isAuthenticated) {
      navigate(path)
    } else {
      // Có thể thêm toast thông báo ở đây: "Vui lòng đăng nhập để thực hiện chức năng này"
      navigate('/login')
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-[#1565C0] shadow-xl border-b border-white/10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4 py-3">

        {/* ── Left Side: Logo & Location ── */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-2xl shrink-0">
            <div className="w-9 h-9 bg-[#FFA726] rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="hidden sm:inline-block tracking-tight" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
              TroTốt
            </span>
          </Link>

          {/* Location Selector (Desktop) */}
          <button className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/10 text-sm font-medium">
            <MapPin className="w-4 h-4 text-[#FFA726]" />
            <span>Toàn quốc</span>
          </button>
        </div>

        {/* ── Center: Search Bar (Desktop) ── */}
        <div className="hidden md:flex flex-1 max-w-xl relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1565C0] transition-colors">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Tìm phòng trọ, căn hộ, chung cư..."
            className="w-full h-11 pl-11 pr-4 bg-white border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FFA726] shadow-inner transition-all"
          />
        </div>

        {/* ── Right Side: Actions ── */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Favorites */}
          <button 
            onClick={() => handleProtectedAction('/yeu-thich')}
            className="p-2 text-white hover:bg-white/10 rounded-full transition-colors relative"
          >
            <Heart className="w-5 h-5" />
            {isAuthenticated && (
               <span className="absolute top-1 right-1 w-2 h-2 bg-[#FFA726] rounded-full border border-[#1565C0]" />
            )}
          </button>

          {/* Auth/User Profile */}
          <div className="hidden sm:flex items-center border-l border-white/20 pl-4 ml-2 gap-3">
            {!isAuthenticated ? (
              <Link to="/login">
                <Button variant="ghost" className="text-white hover:bg-white/10 font-medium h-10">
                  Đăng nhập
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-white">
                  <div className="w-9 h-9 bg-[#FFA726] rounded-full flex items-center justify-center border-2 border-white/20">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <span className="hidden lg:inline-block text-sm font-semibold">{user?.fullName?.split(' ').pop()}</span>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={clearAuth}
                  className="text-white hover:bg-red-500/20 p-2 rounded-full"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>

          {/* Post Ad Button (Primary CTA) */}
          <Button 
            onClick={() => handleProtectedAction('/dang-tin')}
            className="bg-[#FFA726] hover:bg-[#F57C00] text-white font-bold px-4 sm:px-6 rounded-xl shadow-lg shadow-[#FFA726]/20 flex items-center gap-2 h-10 sm:h-11 transform active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden xs:inline">Đăng tin</span>
          </Button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-[#1565C0] border-t border-white/10 px-6 py-4 flex flex-col gap-4">
          {/* Mobile Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full h-10 pl-10 pr-4 bg-white rounded-lg text-sm focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            {!isAuthenticated ? (
              <div className="grid grid-cols-2 gap-3">
                <Link to="/login" onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full text-white border border-white/30">Đăng nhập</Button>
                </Link>
                <Link to="/register" onClick={() => setOpen(false)}>
                  <Button className="w-full bg-white text-[#1565C0] font-bold">Đăng ký</Button>
                </Link>
              </div>
            ) : (
              <div className="bg-white/10 rounded-xl p-4 flex flex-col gap-4">
                <div className="flex items-center gap-3 text-white">
                  <div className="w-12 h-12 bg-[#FFA726] rounded-full flex items-center justify-center">
                    <UserIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold">{user?.fullName}</p>
                    <p className="text-xs text-blue-200">{user?.email}</p>
                  </div>
                </div>
                <Button 
                  onClick={() => { clearAuth(); setOpen(false); }}
                  className="w-full bg-red-500/20 hover:bg-red-500/40 text-white border border-red-500/30 font-semibold"
                >
                  Đăng xuất
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}


