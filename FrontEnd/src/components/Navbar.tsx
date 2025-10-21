import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/store/auth'

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-1 p-2 rounded-lg transition-colors ${
          isActive ? 'text-black font-semibold' : 'text-gray-600 hover:text-black hover:bg-gray-100'
        }`
      }
    >
      {/* Icon sổ sách tối giản (SVG giống tone gốc) */}
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
        <polyline points="10 2 10 18"/>
      </svg>
      <span>{children}</span>
    </NavLink>
  )
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const isAdmin = user?.role === 'admin'

  return (
    <div className="border-b bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-black" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
            <polyline points="10 2 10 18"/>
          </svg>
          <span className="text-xl font-bold text-black">Library System</span>
        </button>

        {/* Menu giữa */}
        <nav className="hidden md:flex flex-grow justify-center space-x-6">
          {user ? (
            <>
              <NavItem to="/dashboard">Trang chủ</NavItem>
              <NavItem to="/books">Sách</NavItem>
              <NavItem to="/my-borrowings">Lịch sử</NavItem>
              {isAdmin && (
                <>
                  <NavItem to="/borrowings">Quản lý mượn trả</NavItem>
                  <NavItem to="/categories">Danh mục</NavItem>
                  <NavItem to="/admin-analytics">Dashboard</NavItem>
                </>
              )}
            </>
          ) : (
            <>
              <NavItem to="/dashboard">Trang chủ</NavItem>
              <NavItem to="/books">Sách</NavItem>
              <NavItem to="/categories">Danh mục</NavItem>
            </>
          )}
        </nav>

        {/* Auth phải */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-2">
              {/* Icon user */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span className="font-semibold text-gray-800 truncate max-w-[12ch]" title={user.name}>
                {user.name}
              </span>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="text-gray-800 hover:text-black font-medium text-sm p-2 transition-colors"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Đăng ký
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
