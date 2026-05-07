import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

const NAV_LINKS = [
  { label: 'Tìm phòng', to: '/tim-phong' },
  { label: 'Cho thuê', to: '/cho-thue' },
  { label: 'Bảng giá', to: '/bang-gia' },
  { label: 'Blog', to: '/blog' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-[#1565C0] shadow-lg">
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl">
          <Home className="w-6 h-6" />
          <span style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>TroTot</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className="text-blue-100 hover:text-white text-sm font-medium transition-colors duration-200"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" className="text-white hover:bg-white/10 border border-white/30">
              Đăng nhập
            </Button>
          </Link>
          <Link to="/register">
            <Button className="bg-white text-[#1565C0] hover:bg-blue-50 font-semibold">
              Đăng ký
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#1565C0] border-t border-white/10 px-6 py-4 flex flex-col gap-3">
          {NAV_LINKS.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className="text-blue-100 hover:text-white py-2 text-sm font-medium"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-white/20">
            <Link to="/login" onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full text-white hover:bg-white/10 border border-white/30">
                Đăng nhập
              </Button>
            </Link>
            <Link to="/register" onClick={() => setOpen(false)}>
              <Button className="w-full bg-white text-[#1565C0] hover:bg-blue-50 font-semibold">
                Đăng ký
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
