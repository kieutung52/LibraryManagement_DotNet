import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Định nghĩa các icon (thay thế cho lucide-react)
const Icon = ({ name }: { name: string }) => {
  const icons: Record<string, JSX.Element> = {
    home: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    book: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>,
    layoutGrid: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>,
    history: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>,
    user: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    shield: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  };
  return <span className="h-5 w-5">{icons[name] || null}</span>;
};

const UserMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <NavLink to="/login" className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">
          Đăng nhập
        </NavLink>
        <NavLink to="/register" className="px-4 py-2 rounded-lg text-sm font-medium bg-black text-white hover:bg-gray-800">
          Đăng ký
        </NavLink>
      </div>
    );
  }

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-gray-100">
        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-600">
          {user.fullName.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-medium">{user.fullName}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border z-50">
          <NavLink to="/profile" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsOpen(false)}>
            Thông tin cá nhân
          </NavLink>
          <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
};

const NavItem = ({ to, icon, label }: { to: string, icon: string, label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? 'bg-black text-white'
          : 'text-gray-700 hover:bg-gray-100'
      }`
    }
  >
    <Icon name={icon} />
    {label}
  </NavLink>
);

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <nav className="w-64 border-r bg-white p-4 flex flex-col gap-4 sticky top-0 h-screen">
        <div className="text-2xl font-bold px-3 py-2">Thư Viện</div>
        <div className="flex flex-col gap-1">
          <NavItem to="/dashboard" icon="home" label="Dashboard" />
          <NavItem to="/books" icon="book" label="Sách" />
          <NavItem to="/categories" icon="layoutGrid" label="Danh mục" />
          
          {(isAuthenticated && !isAdmin) && (
            <NavItem to="/my-borrowings" icon="history" label="Sách của tôi" />
          )}
        </div>

        {isAdmin && (
          <div className="mt-4">
            <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin</h3>
            <div className="flex flex-col gap-1 mt-1">
              <NavItem to="/admin-analytics" icon="shield" label="Thống kê" />
              <NavItem to="/admin/users" icon="user" label="Người dùng" />
              <NavItem to="/admin/borrowings" icon="book" label="Mượn/Trả" />
              <NavItem to="/admin/books" icon="book" label="Quản lý Sách" />
              <NavItem to="/admin/categories" icon="layoutGrid" label="Quản lý Danh mục" />
              <NavItem to="/admin/shelves" icon="shield" label="Quản lý Kệ" />
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50/50">
        <header className="flex items-center justify-end h-16 px-6 border-b bg-white sticky top-0 z-40">
          <UserMenu />
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
