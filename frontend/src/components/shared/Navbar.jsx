import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, Home, LogOut, User as UserIcon, Search, MapPin, Heart, PlusCircle, MessageCircle, Bell, BookOpen, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/useAuthStore'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()

  // Hàm xử lý các hành động yêu cầu đăng nhập
  const handleProtectedAction = (path) => {
    if (isAuthenticated) {
      navigate(path)
    } else {
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

        {/* ── Center Area: Conditional Rendering ── */}
        <div className="hidden md:flex flex-1 max-w-xl justify-center mx-4">
          {!isAuthenticated ? (
            /* 1. HIỂN THỊ SEARCH BAR KHI CHƯA LOGIN */
            <div className="w-full relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1565C0] transition-colors">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Tìm phòng trọ, căn hộ, chung cư..."
                className="w-full h-11 pl-11 pr-4 bg-white border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FFA726] shadow-inner transition-all"
              />
            </div>
          ) : (
            /* 2. HIỂN THỊ MENU ITEMS KHI ĐÃ LOGIN */
            <nav className="flex items-center gap-8">
              <Link
                to="/tim-phong"
                className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-medium transition-all hover:scale-105"
              >
                <Search className="w-4 h-4" />
                Tìm phòng
              </Link>
              <Link
                to="/tin-tuc"
                className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-medium transition-all hover:scale-105"
              >
                <BookOpen className="w-4 h-4" />
                Tin tức
              </Link>
              <Link
                to="/huong-dan"
                className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-medium transition-all hover:scale-105"
              >
                <HelpCircle className="w-4 h-4" />
                Hướng dẫn
              </Link>
              {/* Chỉ hiện cho chủ nhà (owner) */}
              {user?.role === 'owner' && (
                <Link
                  to="/quan-ly-phong"
                  className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg text-[#FFA726] text-sm font-bold border border-[#FFA726]/30 hover:bg-white/20 transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  Quản lý
                </Link>
              )}
            </nav>
          )}
        </div>

        {/* ── Right Side: Actions ── */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Favorites */}
          <button
            onClick={() => handleProtectedAction('/yeu-thich')}
            className="p-2 text-white hover:bg-white/10 rounded-full transition-colors relative"
            title="Tin yêu thích"
          >
            <Heart className="w-5 h-5" />
            {isAuthenticated && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#FFA726] rounded-full border border-[#1565C0]" />
            )}
          </button>

          {/* 💬 Message Icon — placeholder cho tính năng chat realtime */}
          <button
            onClick={() => handleProtectedAction('/tin-nhan')}
            className="p-2 text-white hover:bg-white/10 rounded-full transition-colors relative"
            title="Tin nhắn"
          >
            <MessageCircle className="w-5 h-5" />
            {/* Badge số tin nhắn chưa đọc — sẽ implement sau */}
            {isAuthenticated && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center border border-[#1565C0]">
                0
              </span>
            )}
          </button>

          {/* Notifications */}
          {isAuthenticated && (
            <button
              onClick={() => navigate('/thong-bao')}
              className="p-2 text-white hover:bg-white/10 rounded-full transition-colors relative"
              title="Thông báo"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center border border-[#1565C0]">
                0
              </span>
            </button>
          )}

          {/* ── Auth/User Profile Section ── */}
          <div className="hidden sm:flex items-center border-l border-white/20 pl-3 ml-1 gap-3">
            {isAuthenticated ? (
              /* GIAO DIỆN KHI ĐÃ ĐĂNG NHẬP */
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-all">
                    <UserIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-[10px] text-white/70 leading-none mb-1 uppercase tracking-wider">Thành viên</p>
                    <p className="text-sm font-semibold text-white leading-none">{user?.displayName}</p>
                  </div>
                </div>

                <button
                  onClick={() => logout()}
                  className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                  title="Đăng xuất"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              /* GIAO DIỆN KHI CHƯA ĐĂNG NHẬP */
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" className="text-white hover:bg-white/10">
                    Đăng nhập
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-[#FFA726] hover:bg-[#FB8C00] text-white font-bold px-6 shadow-lg shadow-orange-900/20">
                    Đăng ký
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Post Ad Button (Primary CTA) */}
          <Button
            onClick={() => handleProtectedAction('/dang-tin')}
            className="hidden xs:flex bg-[#FFA726] hover:bg-[#F57C00] text-white font-bold px-4 sm:px-5 rounded-xl shadow-lg shadow-[#FFA726]/20 items-center gap-2 h-10 sm:h-11 transform active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Đăng tin</span>
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
          {/* Mobile Search — chỉ hiện khi chưa đăng nhập */}
          {!isAuthenticated && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-full h-10 pl-10 pr-4 bg-white rounded-lg text-sm focus:outline-none"
              />
            </div>
          )}

          {/* Mobile Nav Links — chỉ hiện khi đã đăng nhập */}
          {isAuthenticated && (
            <div className="flex flex-col gap-1">
              <Link to="/tim-phong" onClick={() => setOpen(false)} className="flex items-center gap-3 text-white/90 hover:text-white py-2.5 border-b border-white/10 text-sm font-medium">
                <Search className="w-4 h-4" /> Tìm phòng
              </Link>
              <Link to="/tin-nhan" onClick={() => setOpen(false)} className="flex items-center gap-3 text-white/90 hover:text-white py-2.5 border-b border-white/10 text-sm font-medium">
                <MessageCircle className="w-4 h-4" /> Tin nhắn
              </Link>
              <Link to="/tin-tuc" onClick={() => setOpen(false)} className="flex items-center gap-3 text-white/90 hover:text-white py-2.5 border-b border-white/10 text-sm font-medium">
                <BookOpen className="w-4 h-4" /> Tin tức
              </Link>
              <Link to="/huong-dan" onClick={() => setOpen(false)} className="flex items-center gap-3 text-white/90 hover:text-white py-2.5 text-sm font-medium">
                <HelpCircle className="w-4 h-4" /> Hướng dẫn
              </Link>
            </div>
          )}

          <div className="flex flex-col gap-2">
            {!isAuthenticated ? (
              /* MOBILE: CHƯA LOGIN */
              <div className="grid grid-cols-2 gap-3">
                <Link to="/login" onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full text-white border border-white/30">Đăng nhập</Button>
                </Link>
                <Link to="/register" onClick={() => setOpen(false)}>
                  <Button className="w-full bg-white text-[#1565C0] font-bold">Đăng ký</Button>
                </Link>
              </div>
            ) : (
              /* MOBILE: ĐÃ LOGIN */
              <div className="bg-white/10 rounded-xl p-4 flex flex-col gap-4">
                <div className="flex items-center gap-3 text-white">
                  <div className="w-12 h-12 bg-[#FFA726] rounded-full flex items-center justify-center">
                    <UserIcon className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">{user?.displayName}</p>
                    <p className="text-xs text-blue-200">{user?.email}</p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  className="w-full bg-red-500 hover:bg-red-600"
                  onClick={() => { logout(); setOpen(false); }}
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
