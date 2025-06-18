// src/apis/notificationApi.ts
import axiosClient from '../axiosClient';

export interface NotificationDTO {
  notificationId: number;
  userId: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  status: string;
  createdAt: string;
  readAt?: string;
  appointmentId?: number;
  doctorId?: number;
  relatedEntityType?: string;
  relatedEntityId?: string;
  actionUrl?: string;
  doctorName?: string;
  appointmentDate?: string;
}

export interface GetNotificationsResponse {
  notifications: NotificationDTO[];
  totalCount: number;
  unreadCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetNotificationsParams {
  page?: number;
  pageSize?: number;
  status?: 'read' | 'unread';
  type?: string;
  priority?: string;
}

// Lấy danh sách thông báo của user hiện tại
export const getUserNotifications = async (params?: GetNotificationsParams) => {
  try {
    const response = await axiosClient.get('/notification', { params });
    return response.data;
  } catch (error) {
    console.error('❌ Lỗi khi lấy danh sách thông báo:', error);
    throw error;
  }
};

// Lấy chi tiết một thông báo
export const getNotificationById = async (notificationId: number) => {
  try {
    const response = await axiosClient.get(`/notification/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Lỗi khi lấy thông báo:', error);
    throw error;
  }
};

// Đánh dấu thông báo đã đọc
export const markNotificationAsRead = async (notificationId: number) => {
  try {
    // Method 1: Thử PUT endpoint đơn lẻ
    try {
      const response = await axiosClient.put(`/notification/${notificationId}/read`);
      return response.data;
    } catch (singleError: any) {
      // Method 2: Fallback - Sử dụng mark-multiple với 1 item
      const response = await axiosClient.put('/notification/mark-multiple-read', {
        notificationIds: [notificationId]
      });
      return response.data;
    }
  } catch (error: any) {
    throw error;
  }
};

// Đánh dấu tất cả thông báo đã đọc
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await axiosClient.put('/notification/mark-all-read');
    return response.data;
  } catch (error) {
    console.error('❌ Lỗi khi đánh dấu tất cả đã đọc:', error);
    throw error;
  }
};

// Xóa thông báo đơn lẻ
export const deleteNotification = async (notificationId: number) => {
  try {
    // Thử method 1: DELETE endpoint đơn lẻ
    try {
      const response = await axiosClient.delete(`/notification/${notificationId}`);
      return response.data;
    } catch (singleError: any) {
      // Method 2: Fallback to delete-multiple với 1 item
      const response = await axiosClient.delete('/notification/delete-multiple', {
        data: { notificationIds: [notificationId] }
      });
      return response.data;
    }
  } catch (error: any) {
    throw error;
  }
};

// Xóa nhiều thông báo
export const deleteMultipleNotifications = async (notificationIds: number[]) => {
  try {
    const response = await axiosClient.delete('/notification/delete-multiple', {
      data: { notificationIds }
    });
    return response.data;
  } catch (error) {
    console.error('❌ Lỗi khi xóa nhiều thông báo:', error);
    throw error;
  }
};