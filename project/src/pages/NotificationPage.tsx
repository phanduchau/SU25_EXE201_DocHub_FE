// src/pages/NotificationPage.tsx
import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Check, 
  Trash2, 
  Calendar,
  User,
  Clock,
  AlertCircle,
  CheckCheck,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { 
  getUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  deleteNotification,
  deleteMultipleNotifications,
  NotificationDTO,
  GetNotificationsResponse,
  GetNotificationsParams
} from '../apis/notification/notificationApi';
import { useNotificationContext } from '../contexts/NotificationContext';
import { toast } from 'react-toastify';

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<GetNotificationsParams>({
    page: 1,
    pageSize: 20
  });
  const [showFilters, setShowFilters] = useState(false);

  const { refreshNotifications } = useNotificationContext();

  // Helper functions
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

  const getNotificationIcon = (type: string) => {
    const normalizedType = type.toLowerCase();
    if (normalizedType.includes('appointment') || normalizedType.includes('lịch hẹn')) {
      return <Calendar className="w-5 h-5 text-blue-500" />;
    } else if (normalizedType.includes('user') || normalizedType.includes('registration') || normalizedType.includes('đăng ký')) {
      return <User className="w-5 h-5 text-green-500" />;
    } else if (normalizedType.includes('system') || normalizedType.includes('welcome') || normalizedType.includes('hệ thống')) {
      return <AlertCircle className="w-5 h-5 text-orange-500" />;
    } else {
      return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return 'border-l-red-500 bg-red-50';
      case 'high':
        return 'border-l-orange-500 bg-orange-50';
      case 'normal':
        return 'border-l-blue-500 bg-blue-50';
      case 'low':
        return 'border-l-gray-500 bg-gray-50';
      default:
        return 'border-l-gray-300 bg-gray-50';
    }
  };

  // Calculated values
  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  // Effects
  useEffect(() => {
    loadNotifications();
  }, [filters]);

  // API Functions
  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await getUserNotifications(filters);
      
      if (response.isSuccess) {
        const data: GetNotificationsResponse = response.result;
        setNotifications(data.notifications);
        setCurrentPage(data.page);
        setTotalPages(data.totalPages);
        setTotalCount(data.totalCount);
      }
    } catch (error) {
      toast.error('Không thể tải thông báo');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      const response = await markNotificationAsRead(notificationId);
      if (response.isSuccess) {
        setNotifications(prev => 
          prev.map(notification => 
            notification.notificationId === notificationId 
              ? { ...notification, status: 'read', readAt: new Date().toISOString() }
              : notification
          )
        );
        refreshNotifications();
        toast.success('Đã đánh dấu là đã đọc');
      }
    } catch (error) {
      toast.error('Không thể đánh dấu đã đọc');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await markAllNotificationsAsRead();
      if (response.isSuccess) {
        setNotifications(prev => 
          prev.map(notification => ({ 
            ...notification, 
            status: 'read', 
            readAt: new Date().toISOString() 
          }))
        );
        refreshNotifications();
        toast.success('Đã đánh dấu tất cả là đã đọc');
      }
    } catch (error) {
      toast.error('Không thể đánh dấu tất cả đã đọc');
    }
  };

  const handleDelete = async (notificationId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa thông báo này?')) {
      return;
    }

    try {
      const response = await deleteNotification(notificationId);
      
      if (response.isSuccess) {
        setNotifications(prev => prev.filter(n => n.notificationId !== notificationId));
        setSelectedNotifications(prev => prev.filter(id => id !== notificationId));
        refreshNotifications();
        toast.success('Đã xóa thông báo');
      } else {
        toast.error(response.errorMessages?.[0] || 'Không thể xóa thông báo');
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.error('Yêu cầu không hợp lệ');
      } else if (error.response?.status === 401) {
        toast.error('Bạn cần đăng nhập lại');
      } else if (error.response?.status === 403) {
        toast.error('Bạn không có quyền xóa thông báo này');
      } else if (error.response?.status === 404) {
        toast.error('Không tìm thấy thông báo');
      } else if (error.response?.status === 500) {
        toast.error('Lỗi máy chủ. Vui lòng thử lại sau.');
      } else if (error.response?.data?.errorMessages?.length > 0) {
        toast.error(error.response.data.errorMessages[0]);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Không thể xóa thông báo. Vui lòng thử lại.');
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedNotifications.length === 0) return;

    if (!confirm(`Bạn có chắc chắn muốn xóa ${selectedNotifications.length} thông báo đã chọn?`)) {
      return;
    }

    try {
      // Method 1: Thử gọi API delete-multiple
      try {
        const response = await deleteMultipleNotifications(selectedNotifications);
        
        if (response.isSuccess) {
          setNotifications(prev => 
            prev.filter(n => !selectedNotifications.includes(n.notificationId))
          );
          setSelectedNotifications([]);
          refreshNotifications();
          toast.success(`Đã xóa ${selectedNotifications.length} thông báo`);
          return;
        }
      } catch (bulkError: any) {
        // Bulk delete failed, try individual deletes
      }
      
      // Method 2: Fallback - Xóa từng cái một
      let successCount = 0;
      let failCount = 0;
      
      for (const notificationId of selectedNotifications) {
        try {
          const response = await deleteNotification(notificationId);
          
          if (response.isSuccess) {
            successCount++;
            setNotifications(prev => prev.filter(n => n.notificationId !== notificationId));
          } else {
            failCount++;
          }
        } catch (error) {
          failCount++;
        }
        
        // Small delay to prevent overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Clear selection and show results
      setSelectedNotifications([]);
      refreshNotifications();
      
      if (successCount > 0) {
        toast.success(`Đã xóa ${successCount} thông báo thành công`);
      }
      
      if (failCount > 0) {
        toast.error(`Không thể xóa ${failCount} thông báo`);
      }
      
    } catch (error: any) {
      toast.error('Có lỗi xảy ra khi xóa thông báo');
    }
  };

  const handleSelectNotification = (notificationId: number) => {
    setSelectedNotifications(prev => {
      if (prev.includes(notificationId)) {
        return prev.filter(id => id !== notificationId);
      } else {
        return [...prev, notificationId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === notifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications.map(n => n.notificationId));
    }
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleFilterChange = (key: keyof GetNotificationsParams, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Bell className="w-6 h-6 mr-2" />
              Thông báo
            </h1>
            <p className="text-gray-600 mt-1">
              Tổng cộng {totalCount} thông báo • {unreadCount} chưa đọc
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Đánh dấu tất cả đã đọc</span>
              </button>
            )}
            
            {selectedNotifications.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xóa ({selectedNotifications.length})</span>
              </button>
            )}
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Bộ lọc</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg border mb-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Tất cả</option>
                  <option value="unread">Chưa đọc</option>
                  <option value="read">Đã đọc</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại</label>
                <select
                  value={filters.type || ''}
                  onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Tất cả</option>
                  <option value="NEW_APPOINTMENT">Lịch hẹn mới</option>
                  <option value="APPOINTMENT_REMINDER">Nhắc nhở lịch hẹn</option>
                  <option value="APPOINTMENT_CANCELLED">Hủy lịch hẹn</option>
                  <option value="USER_REGISTRATION">Đăng ký người dùng</option>
                  <option value="WELCOME_MESSAGE">Chào mừng</option>
                  <option value="SYSTEM">Hệ thống</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mức độ ưu tiên</label>
                <select
                  value={filters.priority || ''}
                  onChange={(e) => handleFilterChange('priority', e.target.value || undefined)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Tất cả</option>
                  <option value="urgent">Khẩn cấp</option>
                  <option value="high">Cao</option>
                  <option value="normal">Bình thường</option>
                  <option value="low">Thấp</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng/trang</label>
                <select
                  value={filters.pageSize || 20}
                  onChange={(e) => handleFilterChange('pageSize', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-500">Đang tải...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">Không có thông báo nào</p>
          </div>
        ) : (
          <>
            {/* Select All Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedNotifications.length === notifications.length && notifications.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">
                  Chọn tất cả ({notifications.length} thông báo)
                </span>
              </label>
            </div>

            {/* Notifications */}
            {notifications.map((notification) => (
              <div
                key={notification.notificationId}
                className={`p-4 border-b border-gray-100 border-l-4 ${getPriorityColor(notification.priority)} ${
                  notification.status === 'unread' ? 'bg-blue-50' : 'bg-white'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification.notificationId)}
                    onChange={() => handleSelectNotification(notification.notificationId)}
                    className="mt-1 rounded border-gray-300"
                  />
                  
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
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        
                        {/* Additional info */}
                        <div className="flex flex-wrap items-center gap-4 mt-2">
                          <span className="text-xs text-gray-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                          
                          {notification.doctorName && (
                            <span className="text-xs text-blue-600">
                              Bác sĩ: {notification.doctorName}
                            </span>
                          )}
                          
                          {notification.appointmentDate && formatDate(notification.appointmentDate) && (
                            <span className="text-xs text-green-600">
                              Lịch hẹn: {formatDate(notification.appointmentDate)}
                            </span>
                          )}
                          
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            notification.status === 'unread' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {notification.status === 'unread' ? 'Chưa đọc' : 'Đã đọc'}
                          </span>
                          
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            notification.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                            notification.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            notification.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {notification.priority === 'urgent' ? 'Khẩn cấp' :
                             notification.priority === 'high' ? 'Cao' :
                             notification.priority === 'normal' ? 'Bình thường' : 'Thấp'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center space-x-1 ml-4">
                        {notification.status === 'unread' && (
                          <button
                            onClick={() => handleMarkAsRead(notification.notificationId)}
                            className="p-2 text-gray-400 hover:text-blue-600 rounded"
                            title="Đánh dấu đã đọc"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDelete(notification.notificationId)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded"
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
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Hiển thị {((currentPage - 1) * (filters.pageSize || 20)) + 1} - {Math.min(currentPage * (filters.pageSize || 20), totalCount)} trong tổng số {totalCount} thông báo
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 text-sm border rounded-md ${
                      pageNum === currentPage
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPage;