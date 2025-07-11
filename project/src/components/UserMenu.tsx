import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Settings, Calendar, CreditCard, LogOut, Bell } from 'lucide-react';
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

     {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <User className="h-4 w-4 mr-3" />
            Thông tin cá nhân
          </Link>
          <Link to="/appointments" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <Calendar className="h-4 w-4 mr-3" />
            Lịch hẹn của tôi
          </Link>
          <Link to="/payment/history" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <CreditCard className="h-4 w-4 mr-3" />
            Lịch sử thanh toán
          </Link>
          <Link to="/notifications" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <Bell className="h-4 w-4 mr-3" />
            Thông báo
          </Link>
          <Link to="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <Settings className="h-4 w-4 mr-3" />
            Cài đặt
          </Link>

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
