// src/contexts/NotificationContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserNotifications, NotificationDTO } from '../apis/notification/notificationApi';
import { useAuthContext } from './AuthContext';

interface NotificationContextType {
  notifications: NotificationDTO[];
  unreadCount: number;
  refreshNotifications: () => Promise<void>;
  markAsRead: (notificationId: number) => void;
  removeNotification: (notificationId: number) => void;
  addNotification: (notification: NotificationDTO) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, token } = useAuthContext();

  // Check if user is authenticated
  const isAuthenticated = !!(user && token);

  // Load notifications khi user đăng nhập
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated, user]);

  // Refresh notifications every 30 seconds for real-time updates
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const interval = setInterval(() => {
      refreshNotifications();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

  const refreshNotifications = async () => {
    try {
      const response = await getUserNotifications({
        page: 1,
        pageSize: 50 // Lấy nhiều hơn để cache
      });

      if (response.isSuccess) {
        setNotifications(response.result.notifications);
        setUnreadCount(response.result.unreadCount);
      }
    } catch (error) {
      console.error('Lỗi khi refresh notifications:', error);
    }
  };

  const markAsRead = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.notificationId === notificationId 
          ? { ...notification, status: 'read', readAt: new Date().toISOString() }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const removeNotification = (notificationId: number) => {
    const deletedNotification = notifications.find(n => n.notificationId === notificationId);
    setNotifications(prev => prev.filter(n => n.notificationId !== notificationId));
    
    if (deletedNotification && deletedNotification.status === 'unread') {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const addNotification = (notification: NotificationDTO) => {
    setNotifications(prev => [notification, ...prev]);
    if (notification.status === 'unread') {
      setUnreadCount(prev => prev + 1);
    }
  };

  const contextValue: NotificationContextType = {
    notifications,
    unreadCount,
    refreshNotifications,
    markAsRead,
    removeNotification,
    addNotification
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};