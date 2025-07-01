// src/apis/vietqr/vietqrApi.ts
import axiosClient from '../axiosClient';
import { logApiResponse, validatePaymentResponse } from '../../utils/apiDebug';

// Types
export interface CreateVietQRPaymentRequest {
  planId: number;
  billingCycle: 'Monthly' | 'Yearly';
}

export interface VietQRPaymentResponse {
  paymentRequestId: number;
  transferCode: string;
  amount: number;
  planName: string;
  billingCycle: string;
  qrCodeUrl: string;
  expiresAt: string;
  expiresInMinutes: number;
  bankAccount: {
    accountNo: string;
    accountName: string;
    bankCode: string;
    bankName: string;
  };
}

export interface PaymentRequestStatus {
  paymentRequestId: number;
  transferCode: string;
  status: 'Pending' | 'Confirmed' | 'Expired' | 'Cancelled';
  amount: number;
  planName: string;
  billingCycle: string;
  createdAt: string;
  expiresAt: string;
  isExpired: boolean;
}

export interface PaymentHistory {
  paymentRequests: PaymentRequestStatus[];
  transactions: TransactionRecord[];
}

export interface TransactionRecord {
  transactionId: number;
  transferCode: string;
  amount: number;
  planName: string;
  billingCycle: string;
  status: string;
  transactionDate: string;
  processedByAdminName: string;
  notes?: string;
}

/**
 * Create VietQR payment request
 */
export const createVietQRPayment = async (request: CreateVietQRPaymentRequest): Promise<VietQRPaymentResponse> => {
  try {
    console.log('🚀 Creating VietQR payment request:', request);
    
    const response = await axiosClient.post('/subscription/payment/vietqr/create', request);
    
    // Log full response for debugging
    logApiResponse('/subscription/payment/vietqr/create', response);
    
    // Validate response structure
    const validation = validatePaymentResponse(response);
    if (!validation.isValid) {
      console.error('❌ Response validation failed:', validation.errors);
      throw new Error(`Response validation failed: ${validation.errors.join(', ')}`);
    }
    
    if (!response.data.isSuccess) {
      const errorMessage = response.data.errorMessages?.[0] || 'Không thể tạo yêu cầu thanh toán';
      console.error('❌ API returned error:', errorMessage);
      throw new Error(errorMessage);
    }
    
    const result = response.data.result;
    console.log('✅ Payment request created successfully:', {
      paymentRequestId: result.paymentRequestId,
      transferCode: result.transferCode,
      amount: result.amount,
      planName: result.planName
    });
    
    return result;
  } catch (error: any) {
    console.error('❌ Error in createVietQRPayment:', error);
    
    // Log detailed error information
    if (error.response) {
      console.error('Error Response Status:', error.response.status);
      console.error('Error Response Data:', error.response.data);
      console.error('Error Response Headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error Request:', error.request);
    } else {
      console.error('Error Message:', error.message);
    }
    
    if (error.response?.status === 409) {
      throw new Error('Bạn đã có gói thành viên đang hoạt động hoặc có yêu cầu thanh toán đang chờ xử lý');
    }
    
    throw new Error(error.response?.data?.errorMessages?.[0] || error.message || 'Có lỗi xảy ra khi tạo thanh toán');
  }
};


/**
 * Get payment request status
 */
export const getVietQRPaymentStatus = async (paymentRequestId: number): Promise<PaymentRequestStatus> => {
  try {
    const response = await axiosClient.get(`/subscription/payment/vietqr/status/${paymentRequestId}`);
    
    if (!response.data.isSuccess) {
      throw new Error(response.data.errorMessages?.[0] || 'Không thể lấy trạng thái thanh toán');
    }
    
    return response.data.result;
  } catch (error: any) {
    console.error('Error getting payment status:', error);
    throw new Error(error.response?.data?.errorMessages?.[0] || 'Có lỗi xảy ra khi kiểm tra trạng thái thanh toán');
  }
};

/**
 * Get user's VietQR payment history
 */
export const getVietQRPaymentHistory = async (): Promise<PaymentHistory> => {
  try {
    const response = await axiosClient.get('/subscription/payment/vietqr/history');
    
    if (!response.data.isSuccess) {
      throw new Error(response.data.errorMessages?.[0] || 'Không thể lấy lịch sử thanh toán');
    }
    
    return response.data.result;
  } catch (error: any) {
    console.error('Error getting payment history:', error);
    throw new Error(error.response?.data?.errorMessages?.[0] || 'Có lỗi xảy ra khi lấy lịch sử thanh toán');
  }
};

/**
 * Cancel a pending payment request
 */
export const cancelVietQRPayment = async (paymentRequestId: number): Promise<boolean> => {
  try {
    const response = await axiosClient.post(`/vietqr-payment/cancel/${paymentRequestId}`);
    
    if (!response.data.isSuccess) {
      throw new Error(response.data.errorMessages?.[0] || 'Không thể hủy yêu cầu thanh toán');
    }
    
    return response.data.result;
  } catch (error: any) {
    console.error('Error canceling payment:', error);
    throw new Error(error.response?.data?.errorMessages?.[0] || 'Có lỗi xảy ra khi hủy thanh toán');
  }
};

/**
 * Verify transfer code format
 */
export const verifyTransferCode = (transferCode: string): boolean => {
  // DOCHUB-XXXXXX-DDMMMYYYY-XXX format
  const pattern = /^DOCHUB-[A-Z0-9]{6}-[0-9]{2}[A-Z]{3}[0-9]{4}-[0-9]{3}$/;
  return pattern.test(transferCode);
};

/**
 * Format currency for Vietnamese locale
 */
export const formatVietnamCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Calculate time remaining in readable format
 */
export const calculateTimeRemaining = (expiresAt: string): {
  totalSeconds: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  formatted: string;
} => {
  const now = new Date().getTime();
  const expiry = new Date(expiresAt).getTime();
  const totalSeconds = Math.max(0, Math.floor((expiry - now) / 1000));
  
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const isExpired = totalSeconds <= 0;
  
  const formatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  return {
    totalSeconds,
    minutes,
    seconds,
    isExpired,
    formatted
  };
};

/**
 * Copy text to clipboard with fallback
 */
export const copyToClipboardWithFallback = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers or non-HTTPS
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (error) {
    console.error('Failed to copy text to clipboard:', error);
    return false;
  }
};

/**
 * Format date for Vietnamese locale
 */
export const formatVietnameseDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Get relative time string
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

// Export all utility functions
export const VietQRUtils = {
  verifyTransferCode,
  formatVietnamCurrency,
  calculateTimeRemaining,
  copyToClipboardWithFallback,
  formatVietnameseDate,
  getRelativeTimeString
};

// Export default object with all functions
export default {
  // API Functions
  createVietQRPayment,
  getVietQRPaymentStatus,
  getVietQRPaymentHistory,
  cancelVietQRPayment,
  
  // Utility Functions
  ...VietQRUtils
};