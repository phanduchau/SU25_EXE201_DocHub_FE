import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Settings, Calendar, CreditCard, LogOut, Bell, BarChart3 } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleMenu = () => {
    if (!user) {
      toast.info('Vui lòng đăng nhập để sử dụng menu cá nhân');
      navigate('/login');
      return;
    }
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (user?.role === 'admin') {
      return '/admin';
    } else if (user?.role === 'doctor') {
      return '/doctor-dashboard';
    }
    return '/profile';
  };

  const getDashboardLabel = () => {
    if (user?.role === 'admin') {
      return 'Quản trị hệ thống';
    } else if (user?.role === 'doctor') {
      return 'Bảng điều khiển bác sĩ';
    }
    return 'Thông tin cá nhân';
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={handleToggleMenu}
        className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <User className="h-5 w-5 text-gray-500" />
        </div>
        {user && (
          <span className="text-sm font-medium text-gray-700 hidden md:inline">
            {`Welcome: ${user.name}`}
          </span>
        )}
      </button>

      {user && isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 border border-gray-200 z-50">
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900">{user?.name || 'Người dùng'}</p>
            <p className="text-sm text-gray-500">{user?.email || ''}</p>
            {user?.role && (
              <p className="text-xs text-teal-600 font-medium capitalize">
                {user.role === 'admin' ? 'Quản trị viên' : 
                 user.role === 'doctor' ? 'Bác sĩ' : 'Bệnh nhân'}
              </p>
            )}
          </div>

          <div className="py-2">
            <Link 
              to={getDashboardLink()} 
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {user?.role === 'admin' ? (
                <BarChart3 className="h-4 w-4 mr-3" />
              ) : (
                <User className="h-4 w-4 mr-3" />
              )}
              {getDashboardLabel()}
            </Link>
            
            {user?.role !== 'admin' && user?.role !== 'doctor' && (
              <Link to="/appointments" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <Calendar className="h-4 w-4 mr-3" />
                Lịch hẹn của tôi
              </Link>
            )}
            
            <Link to="/notifications" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <Bell className="h-4 w-4 mr-3" />
              Thông báo
            </Link>
            
            <Link to="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <Settings className="h-4 w-4 mr-3" />
              Cài đặt
            </Link>
            
            {user?.role !== 'admin' && user?.role !== 'doctor' && (
              <Link to="/payment" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <CreditCard className="h-4 w-4 mr-3" />
                Phương thức thanh toán
              </Link>
            )}
          </div>

          <div className="border-t border-gray-200 py-2">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;