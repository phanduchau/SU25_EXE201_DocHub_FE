// src/apis/vietqr/adminVietQRApi.ts - Admin API functions cho VietQR payment management
import axiosClient from '../axiosClient';

export interface PaymentRequestSearchParams {
  transferCode?: string;
  status?: 'Pending' | 'Confirmed' | 'Expired' | 'Cancelled';
  fromDate?: string;
  toDate?: string;
  userId?: string;
  page?: number;
  pageSize?: number;
}

export interface AdminPaymentRequest {
  paymentRequestId: number;
  userId: string;
  userName: string;
  userEmail: string;
  planName: string;
  transferCode: string;
  amount: number;
  billingCycle: string;
  status: string;
  createdAt: string;
  expiresAt: string;
  confirmedAt?: string;
  confirmedByAdminName?: string;
  notes?: string;
  isExpired: boolean;
  bankAccount: {
    accountNo: string;
    accountName: string;
    bankCode: string;
    bankName: string;
  };
}

export interface ConfirmPaymentRequest {
  notes?: string;
}

export interface VietQRStats {
  totalRequests: number;
  pendingRequests: number;
  confirmedRequests: number;
  expiredRequests: number;
  totalAmount: number;
  todayRequests: number;
}

/**
 * Search VietQR payment requests (Admin only)
 */
export const searchVietQRPaymentRequests = async (params: PaymentRequestSearchParams): Promise<AdminPaymentRequest[]> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.transferCode) queryParams.append('transferCode', params.transferCode);
    if (params.status) queryParams.append('status', params.status);
    if (params.fromDate) queryParams.append('fromDate', params.fromDate);
    if (params.toDate) queryParams.append('toDate', params.toDate);
    if (params.userId) queryParams.append('userId', params.userId);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());

    const response = await axiosClient.get(`/admin/vietqr/payment-requests?${queryParams.toString()}`);
    
    if (!response.data.isSuccess) {
      throw new Error(response.data.errorMessages?.[0] || 'Không thể tải danh sách yêu cầu thanh toán');
    }
    
    console.log('✅ Admin VietQR requests loaded:', response.data.result.length, 'items');
    return response.data.result;
  } catch (error: any) {
    console.error('❌ Error searching payment requests:', error);
    throw new Error(error.response?.data?.errorMessages?.[0] || 'Có lỗi xảy ra khi tìm kiếm yêu cầu thanh toán');
  }
};

/**
 * Confirm VietQR payment (Admin only)
 */
export const confirmVietQRPayment = async (paymentRequestId: number, confirmData: ConfirmPaymentRequest): Promise<boolean> => {
  try {
    console.log('🔐 Admin confirming payment:', paymentRequestId, confirmData);
    
    const response = await axiosClient.post(`/admin/vietqr/confirm-payment/${paymentRequestId}`, confirmData);
    
    if (!response.data.isSuccess) {
      throw new Error(response.data.errorMessages?.[0] || 'Không thể xác nhận thanh toán');
    }
    
    console.log('✅ Payment confirmed successfully by admin');
    return response.data.result.success || true;
  } catch (error: any) {
    console.error('❌ Error confirming payment:', error);
    
    if (error.response?.status === 404) {
      throw new Error('Không tìm thấy yêu cầu thanh toán');
    }
    
    if (error.response?.status === 400) {
      throw new Error('Yêu cầu thanh toán không hợp lệ hoặc đã được xử lý');
    }
    
    if (error.response?.status === 403) {
      throw new Error('Bạn không có quyền xác nhận thanh toán này');
    }
    
    throw new Error(error.response?.data?.errorMessages?.[0] || 'Có lỗi xảy ra khi xác nhận thanh toán');
  }
};

/**
 * Get VietQR payment statistics (Admin only)
 */
export const getVietQRStats = async (): Promise<VietQRStats> => {
  try {
    const response = await axiosClient.get('/admin/vietqr/stats');
    
    if (!response.data.isSuccess) {
      throw new Error(response.data.errorMessages?.[0] || 'Không thể lấy thống kê thanh toán');
    }
    
    return response.data.result;
  } catch (error: any) {
    console.error('Error getting VietQR stats:', error);
    throw new Error(error.response?.data?.errorMessages?.[0] || 'Có lỗi xảy ra khi lấy thống kê');
  }
};

/**
 * Get payment request details by ID (Admin only)
 */
export const getVietQRPaymentDetails = async (paymentRequestId: number): Promise<AdminPaymentRequest> => {
  try {
    const response = await axiosClient.get(`/admin/vietqr/payment-request/${paymentRequestId}`);
    
    if (!response.data.isSuccess) {
      throw new Error(response.data.errorMessages?.[0] || 'Không thể lấy chi tiết yêu cầu thanh toán');
    }
    
    return response.data.result;
  } catch (error: any) {
    console.error('Error getting payment details:', error);
    throw new Error(error.response?.data?.errorMessages?.[0] || 'Có lỗi xảy ra khi lấy chi tiết thanh toán');
  }
};

/**
 * Export VietQR payment data to CSV (Admin only)
 */
export const exportVietQRData = async (params: PaymentRequestSearchParams): Promise<Blob> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.transferCode) queryParams.append('transferCode', params.transferCode);
    if (params.status) queryParams.append('status', params.status);
    if (params.fromDate) queryParams.append('fromDate', params.fromDate);
    if (params.toDate) queryParams.append('toDate', params.toDate);

    const response = await axiosClient.get(`/admin/vietqr/export?${queryParams.toString()}`, {
      responseType: 'blob'
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Error exporting VietQR data:', error);
    throw new Error('Có lỗi xảy ra khi xuất dữ liệu');
  }
};

/**
 * Bulk confirm multiple payments (Admin only)
 */
export const bulkConfirmPayments = async (paymentRequestIds: number[], notes?: string): Promise<{
  successCount: number;
  failedCount: number;
  errors: string[];
}> => {
  try {
    const response = await axiosClient.post('/admin/vietqr/bulk-confirm', {
      paymentRequestIds,
      notes
    });
    
    if (!response.data.isSuccess) {
      throw new Error(response.data.errorMessages?.[0] || 'Không thể xác nhận hàng loạt');
    }
    
    return response.data.result;
  } catch (error: any) {
    console.error('Error bulk confirming payments:', error);
    throw new Error(error.response?.data?.errorMessages?.[0] || 'Có lỗi xảy ra khi xác nhận hàng loạt');
  }
};

/**
 * Get pending payments count (for dashboard notification)
 */
export const getPendingPaymentsCount = async (): Promise<number> => {
  try {
    const response = await axiosClient.get('/admin/vietqr/pending-count');
    
    if (!response.data.isSuccess) {
      return 0;
    }
    
    return response.data.result.count || 0;
  } catch (error: any) {
    console.error('Error getting pending payments count:', error);
    return 0;
  }
};

/**
 * Format currency for Vietnamese locale
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format date for Vietnamese locale
 */
export const formatVietnameseDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Download exported data as file
 */
export const downloadExportedData = (data: Blob, filename: string = 'vietqr-payments.csv') => {
  const url = window.URL.createObjectURL(data);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Get payment status color for UI
 */
export const getPaymentStatusColor = (status: string, isExpired: boolean): {
  bg: string;
  text: string;
  border: string;
} => {
  if (isExpired && status === 'Pending') {
    return {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-300'
    };
  }

  switch (status) {
    case 'Pending':
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        border: 'border-yellow-300'
      };
    case 'Confirmed':
      return {
        bg: 'bg-green-100',
        text: 'text-green-700',
        border: 'border-green-300'
      };
    case 'Expired':
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        border: 'border-gray-300'
      };
    case 'Cancelled':
      return {
        bg: 'bg-red-100',
        text: 'text-red-700',
        border: 'border-red-300'
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        border: 'border-gray-300'
      };
  }
};

/**
 * Validate search parameters
 */
export const validateSearchParams = (params: PaymentRequestSearchParams): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (params.fromDate && params.toDate) {
    const fromDate = new Date(params.fromDate);
    const toDate = new Date(params.toDate);
    
    if (fromDate > toDate) {
      errors.push('Ngày bắt đầu không thể lớn hơn ngày kết thúc');
    }
    
    const daysDiff = (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff > 365) {
      errors.push('Khoảng thời gian tìm kiếm không được vượt quá 1 năm');
    }
  }
  
  if (params.page && params.page < 1) {
    errors.push('Số trang phải lớn hơn 0');
  }
  
  if (params.pageSize && (params.pageSize < 1 || params.pageSize > 100)) {
    errors.push('Kích thước trang phải từ 1 đến 100');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Get relative time string for Vietnamese
 */
export const getRelativeTimeString = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMinutes < 1) {
    return 'Vừa xong';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} phút trước`;
  } else if (diffHours < 24) {
    return `${diffHours} giờ trước`;
  } else if (diffDays < 7) {
    return `${diffDays} ngày trước`;
  } else {
    return formatVietnameseDate(dateString);
  }
};

// Export utility functions
export const AdminVietQRUtils = {
  formatCurrency,
  formatVietnameseDate,
  downloadExportedData,
  getPaymentStatusColor,
  validateSearchParams,
  getRelativeTimeString
};

// Export default object with all functions
export default {
  // API Functions
  searchVietQRPaymentRequests,
  confirmVietQRPayment,
  getVietQRStats,
  getVietQRPaymentDetails,
  exportVietQRData,
  bulkConfirmPayments,
  getPendingPaymentsCount,
  
  // Utility Functions
  ...AdminVietQRUtils
};