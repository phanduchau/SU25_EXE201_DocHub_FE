// src/components/NotificationDropdown.tsx (Updated với Context)
import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  X, 
  Check, 
  Trash2, 
  MoreHorizontal,
  Calendar,
  User,
  Clock,
  AlertCircle,
  CheckCheck
} from 'lucide-react';
import { 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  deleteNotification,
  NotificationDTO 
} from '../apis/notification/notificationApi';
import { useNotificationContext } from '../contexts/NotificationContext';
import { toast } from 'react-toastify';

interface NotificationDropdownProps {
  className?: string;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { 
    notifications, 
    unreadCount, 
    refreshNotifications,
    markAsRead: contextMarkAsRead,
    removeNotification: contextRemoveNotification
  } = useNotificationContext();

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Refresh notifications khi mở dropdown
  useEffect(() => {
    if (isOpen) {
      refreshNotifications();
    }
  }, [isOpen, refreshNotifications]);

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      const response = await markNotificationAsRead(notificationId);
      if (response.isSuccess) {
        contextMarkAsRead(notificationId);
        toast.success('Đã đánh dấu là đã đọc');
      }
    } catch (error) {
      toast.error('Không thể đánh dấu đã đọc');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setLoading(true);
      const response = await markAllNotificationsAsRead();
      if (response.isSuccess) {
        // Refresh lại toàn bộ notifications
        await refreshNotifications();
        toast.success('Đã đánh dấu tất cả là đã đọc');
      }
    } catch (error) {
      toast.error('Không thể đánh dấu tất cả đã đọc');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (notificationId: number) => {
    try {
      const response = await deleteNotification(notificationId);
      
      if (response.isSuccess) {
        contextRemoveNotification(notificationId);
        toast.success('Đã xóa thông báo');
      } else {
        toast.error(response.errorMessages?.[0] || 'Không thể xóa thông báo');
      }
    } catch (error: any) {
      // Hiển thị lỗi chi tiết
      if (error.response?.data?.errorMessages?.length > 0) {
        toast.error(error.response.data.errorMessages[0]);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Không thể xóa thông báo');
      }
    }
  };

  const getNotificationIcon = (type: string) => {
    const normalizedType = type.toLowerCase();
    if (normalizedType.includes('appointment') || normalizedType.includes('lịch hẹn')) {
      return <Calendar className="w-4 h-4 text-blue-500" />;
    } else if (normalizedType.includes('user') || normalizedType.includes('registration') || normalizedType.includes('đăng ký')) {
      return <User className="w-4 h-4 text-green-500" />;
    } else if (normalizedType.includes('system') || normalizedType.includes('welcome') || normalizedType.includes('hệ thống')) {
      return <AlertCircle className="w-4 h-4 text-orange-500" />;
    } else {
      return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return 'border-l-red-500';
      case 'high':
        return 'border-l-orange-500';
      case 'normal':
        return 'border-l-blue-500';
      case 'low':
        return 'border-l-gray-500';
      default:
        return 'border-l-gray-300';
    }
  };

  const formatTimeAgo = (dateString: string) => {
  try {
    // Parse date - assume backend sends ISO string or proper format
    let date = new Date(dateString);
    
    // If backend sends UTC, ensure we treat it as UTC
    if (dateString.includes('Z') || dateString.includes('+')) {
      // Already has timezone info, use as-is
      date = new Date(dateString);
    } else {
      // Assume backend sends local time, convert to proper format
      date = new Date(dateString + 'Z'); // Add Z to treat as UTC
    }
    
    if (isNaN(date.getTime())) return 'Không xác định';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    // Debug cho lần đầu
    console.log('Time debug:', {
      input: dateString,
      parsed: date.toISOString(),
      now: now.toISOString(),
      diffMins
    });

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  } catch (error) {
    return 'Không xác định';
  }
};

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;
      
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return null;
    }
  };

  // Lấy 10 notifications mới nhất để hiển thị
  const displayNotifications = notifications.slice(0, 10);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[500px] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Thông báo</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={loading}
                  className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 flex items-center space-x-1"
                  title="Đánh dấu tất cả đã đọc"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>{loading ? 'Đang xử lý...' : 'Đánh dấu tất cả'}</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {displayNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Không có thông báo nào</p>
              </div>
            ) : (
              <>
                {displayNotifications.map((notification) => (
                  <div
                    key={notification.notificationId}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 border-l-4 ${getPriorityColor(notification.priority)} ${
                      notification.status === 'unread' ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className={`text-sm font-medium text-gray-900 ${
                              notification.status === 'unread' ? 'font-semibold' : ''
                            }`}>
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            
                            {/* Additional info */}
                            {notification.doctorName && (
                              <p className="text-xs text-blue-600 mt-1">
                                Bác sĩ: {notification.doctorName}
                              </p>
                            )}
                            
                            {notification.appointmentDate && formatDate(notification.appointmentDate) && (
                              <p className="text-xs text-green-600 mt-1">
                                Lịch hẹn: {formatDate(notification.appointmentDate)}
                              </p>
                            )}
                            
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-xs text-gray-500 flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {formatTimeAgo(notification.createdAt)}
                              </span>
                              
                              {notification.status === 'unread' && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                  Chưa đọc
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center space-x-1 ml-2">
                            {notification.status === 'unread' && (
                              <button
                                onClick={() => handleMarkAsRead(notification.notificationId)}
                                className="p-1 text-gray-400 hover:text-blue-600 rounded"
                                title="Đánh dấu đã đọc"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleDelete(notification.notificationId)}
                              className="p-1 text-gray-400 hover:text-red-600 rounded"
                              title="Xóa thông báo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* View All Link */}
                {notifications.length > 10 && (
                  <div className="p-4 text-center border-t border-gray-200">
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        // Navigate to full notifications page
                        window.location.href = '/notifications';
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Xem tất cả ({notifications.length} thông báo)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;