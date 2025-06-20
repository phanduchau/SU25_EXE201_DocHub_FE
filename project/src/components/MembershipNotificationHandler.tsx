import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle, Gift, Crown } from 'lucide-react';

interface MembershipNotification {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
  planName?: string;
  benefits?: string[];
  action?: {
    text: string;
    url: string;
  };
}

const MembershipNotificationHandler: React.FC = () => {
  const [notifications, setNotifications] = useState<MembershipNotification[]>([]);
  const [currentNotification, setCurrentNotification] = useState<MembershipNotification | null>(null);

  useEffect(() => {
    // Check for membership notifications on component mount
    checkMembershipNotifications();
    
    // Listen for membership events
    const handleMembershipEvent = (event: CustomEvent) => {
      addNotification(event.detail);
    };

    window.addEventListener('membershipActivated', handleMembershipEvent as EventListener);
    window.addEventListener('membershipExpiring', handleMembershipEvent as EventListener);
    window.addEventListener('membershipCancelled', handleMembershipEvent as EventListener);

    return () => {
      window.removeEventListener('membershipActivated', handleMembershipEvent as EventListener);
      window.removeEventListener('membershipExpiring', handleMembershipEvent as EventListener);
      window.removeEventListener('membershipCancelled', handleMembershipEvent as EventListener);
    };
  }, []);

  const checkMembershipNotifications = () => {
    // Check URL params for membership events
    const urlParams = new URLSearchParams(window.location.search);
    const membershipEvent = urlParams.get('membership');
    const planName = urlParams.get('plan');

    if (membershipEvent === 'activated' && planName) {
      addNotification({
        id: Date.now().toString(),
        type: 'success',
        title: '🎉 Chúc mừng!',
        message: `Gói ${planName} đã được kích hoạt thành công!`,
        planName,
        benefits: [
          'Đặt lịch hẹn ưu tiên',
          'Tư vấn không giới hạn',
          'Video call với bác sĩ',
          'Báo cáo sức khỏe chi tiết'
        ],
        action: {
          text: 'Đặt lịch hẹn ngay',
          url: '/appointments'
        }
      });

      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Check localStorage for pending notifications
    const pendingNotification = localStorage.getItem('membershipNotification');
    if (pendingNotification) {
      try {
        const notification = JSON.parse(pendingNotification);
        addNotification(notification);
        localStorage.removeItem('membershipNotification');
      } catch (error) {
        console.error('Error parsing membership notification:', error);
      }
    }
  };

  const addNotification = (notification: MembershipNotification) => {
    setNotifications(prev => [...prev, notification]);
    setCurrentNotification(notification);

    // Auto hide after 10 seconds
    setTimeout(() => {
      hideNotification(notification.id);
    }, 10000);
  };

  const hideNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setCurrentNotification(prev => prev?.id === id ? null : prev);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'warning':
        return <Bell className="w-6 h-6 text-yellow-600" />;
      case 'info':
        return <Crown className="w-6 h-6 text-blue-600" />;
      default:
        return <Gift className="w-6 h-6 text-purple-600" />;
    }
  };

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-purple-50 border-purple-200 text-purple-800';
    }
  };

  if (!currentNotification) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className={`border rounded-lg shadow-lg p-4 ${getNotificationStyle(currentNotification.type)} animate-slide-in`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            {getNotificationIcon(currentNotification.type)}
            <h4 className="font-bold ml-2">{currentNotification.title}</h4>
          </div>
          <button
            onClick={() => hideNotification(currentNotification.id)}
            className="text-gray-400 hover:text-gray-600 ml-2"
          >
            ✕
          </button>
        </div>

        {/* Message */}
        <p className="mb-4">{currentNotification.message}</p>

        {/* Benefits List */}
        {currentNotification.benefits && (
          <div className="mb-4">
            <p className="font-medium mb-2">Quyền lợi của bạn:</p>
            <ul className="space-y-1">
              {currentNotification.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Button */}
        {currentNotification.action && (
          <button
            onClick={() => {
              window.location.href = currentNotification.action!.url;
              hideNotification(currentNotification.id);
            }}
            className="w-full bg-white text-blue-600 border border-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition-all"
          >
            {currentNotification.action.text}
          </button>
        )}
      </div>
    </div>
  );
};

// Utility functions to trigger notifications from other components
export const triggerMembershipNotification = (notification: Partial<MembershipNotification>) => {
  const event = new CustomEvent('membershipActivated', { 
    detail: {
      id: Date.now().toString(),
      type: 'success',
      ...notification
    }
  });
  window.dispatchEvent(event);
};

export const saveMembershipNotificationForLater = (notification: MembershipNotification) => {
  localStorage.setItem('membershipNotification', JSON.stringify(notification));
};

// CSS Animation (add to your global CSS)
const notificationStyles = `
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}
`;

export default MembershipNotificationHandler;