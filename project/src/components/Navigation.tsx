import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import UserMenu from './UserMenu';
import NotificationDropdown from './NotificationDropdown';
import { useAuthContext } from '../contexts/AuthContext';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { user } = useAuthContext();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between shadow-sm relative z-50">
      <div className="flex items-center space-x-10">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>

        <div className="hidden md:flex space-x-6">
          <NavLink to="/" active={isActive('/')}>
            Trang chủ
          </NavLink>
          <NavLink to="/doctors" active={isActive('/doctors')}>
            Tìm bác sĩ
          </NavLink>
          <NavLink to="/news" active={isActive('/news')}>
            Tin tức y tế
          </NavLink>
          <NavLink to="/membership" active={isActive('/membership')}>
            Membership
          </NavLink>
          {user?.role?.includes('Admin') && (
            <NavLink to="/admin" active={isActive('/admin')}>
              Admin Dashboard
            </NavLink>
          )}
          {user?.role?.includes('Doctor') && (
            <NavLink to="/doctor-dashboard" active={isActive('/doctor-dashboard')}>
              Bác sĩ Dashboard
            </NavLink>
          )}
          <NavLink to="/landing" active={isActive('/landing')}>
            About me
          </NavLink>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <NotificationDropdown />
        <UserMenu />
      </div>
    </nav>
  );
};


interface NavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, active, children }) => {
  return (
    <Link
      to={to}
      className={`px-1 py-2 font-medium transition-colors ${active
        ? 'text-teal-600 border-b-2 border-teal-600'
        : 'text-gray-600 hover:text-teal-600'
        }`}
    >
      {children}
    </Link>
  );
};

export default Navigation;