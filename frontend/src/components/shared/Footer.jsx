import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

// SVG icons cho social media (lucide-react đã xóa các icon này từ v0.400+)
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
)

const LINKS = {
  'Khám phá': [
    { label: 'Phòng trọ', to: '/phong-tro' },
    { label: 'Căn hộ', to: '/can-ho' },
    { label: 'Nhà nguyên căn', to: '/nha-nguyen-can' },
    { label: 'Ở ghép', to: '/o-ghep' },
  ],
  'Khu vực': [
    { label: 'Hồ Chí Minh', to: '/tim-phong?city=hcm' },
    { label: 'Hà Nội', to: '/tim-phong?city=hn' },
    { label: 'Đà Nẵng', to: '/tim-phong?city=dn' },
    { label: 'Cần Thơ', to: '/tim-phong?city=ct' },
  ],
  'Thông tin': [
    { label: 'Về chúng tôi', to: '/ve-chung-toi' },
    { label: 'Liên hệ', to: '/lien-he' },
    { label: 'Điều khoản', to: '/dieu-khoan' },
    { label: 'Bảo mật', to: '/bao-mat' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#021f29] text-white">
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl mb-3">
              <Home className="w-6 h-6 text-[#FFA726]" />
              <span style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>TroTot</span>
            </Link>
            <p className="text-blue-200 text-sm leading-relaxed mb-4">
              Nền tảng thuê phòng tin cậy tại Việt Nam.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"
                className="w-9 h-9 bg-white/10 hover:bg-[#1565C0] rounded-full flex items-center justify-center transition-colors">
                <FacebookIcon />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"
                className="w-9 h-9 bg-white/10 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors">
                <YoutubeIcon />
              </a>
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm mb-4 text-white/90">{title}</h4>
              <ul className="space-y-2">
                {links.map(l => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-blue-200 hover:text-white text-sm transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-blue-200 text-xs">© 2024 TroTot. Nền tảng thuê phòng tin cậy tại Việt Nam.</p>
          <p className="text-blue-200 text-xs">Thiết kế bởi đội ngũ TroTot ❤️</p>
        </div>
      </div>
    </footer>
  )
}
