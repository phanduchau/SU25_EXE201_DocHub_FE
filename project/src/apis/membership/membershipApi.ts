// src/apis/membership/membershipApi.ts

import axiosClient from '../axiosClient';

// Types
export interface MembershipPlan {
  planId: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionPaymentDTO {
  planId: string;
  billingCycle: 'Monthly' | 'Yearly';
  paymentMethod: 'vnpay' | 'momo';
}

export interface PaymentUrlResponse {
  paymentUrl: string;
  transactionRef: string;
  amount: number;
  planName: string;
  billingCycle: string;
}

export interface SubscriptionDTO {
  subscriptionId: string;
  userId: string;
  planId: string;
  planName: string;
  status: 'Active' | 'Expired' | 'Cancelled';
  billingCycle: 'Monthly' | 'Yearly';
  amount: number;
  paymentMethod: string;
  paymentGatewayTransactionId: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentStatusResponse {
  status: 'Pending' | 'Completed' | 'Failed';
  subscription?: SubscriptionDTO;
  message?: string;
}

// API Functions

/**
 * Lấy danh sách các gói membership
 */
export const getMembershipPlans = async (): Promise<MembershipPlan[]> => {
  try {
    const response = await axiosClient.get('/subscription/plans');
    return response.data.result || [];
  } catch (error: any) {
    console.error('Error fetching membership plans:', error);
    throw new Error(error.response?.data?.errorMessages?.[0] || 'Không thể tải danh sách gói membership');
  }
};

/**
 * Tạo URL thanh toán cho gói membership
 */
export const createPaymentUrl = async (
  paymentData: CreateSubscriptionPaymentDTO
): Promise<PaymentUrlResponse> => {
  try {
    const response = await axiosClient.post('/subscription/payment/create-payment-url', paymentData);
    
    if (!response.data.isSuccess) {
      throw new Error(response.data.errorMessages?.[0] || 'Không thể tạo liên kết thanh toán');
    }
    
    return response.data.result;
  } catch (error: any) {
    console.error('Error creating payment URL:', error);
    
    if (error.response?.status === 409) {
      throw new Error('Bạn đã có gói thành viên đang hoạt động');
    }
    
    throw new Error(error.response?.data?.errorMessages?.[0] || error.message || 'Có lỗi xảy ra khi tạo thanh toán');
  }
};

/**
 * Kiểm tra trạng thái thanh toán
 */
export const getPaymentStatus = async (transactionRef: string): Promise<PaymentStatusResponse> => {
  try {
    const response = await axiosClient.get(`/subscription/payment/payment-status/${transactionRef}`);
    
    if (!response.data.isSuccess) {
      throw new Error(response.data.errorMessages?.[0] || 'Không thể kiểm tra trạng thái thanh toán');
    }
    
    return response.data.result;
  } catch (error: any) {
    console.error('Error getting payment status:', error);
    throw new Error(error.response?.data?.errorMessages?.[0] || 'Có lỗi xảy ra khi kiểm tra trạng thái thanh toán');
  }
};

/**
 * Lấy thông tin subscription của user hiện tại
 */
export const getUserSubscription = async (): Promise<SubscriptionDTO | null> => {
  try {
    const response = await axiosClient.get('/subscription/user-subscription');
    return response.data.result;
  } catch (error: any) {
    console.error('Error fetching user subscription:', error);
    
    if (error.response?.status === 404) {
      return null; // User chưa có subscription
    }
    
    throw new Error(error.response?.data?.errorMessages?.[0] || 'Không thể tải thông tin subscription');
  }
};

/**
 * Lấy chi tiết subscription theo ID
 */
export const getSubscriptionById = async (subscriptionId: string): Promise<SubscriptionDTO> => {
  try {
    const response = await axiosClient.get(`/subscription/${subscriptionId}`);
    
    if (!response.data.isSuccess) {
      throw new Error(response.data.errorMessages?.[0] || 'Không tìm thấy subscription');
    }
    
    return response.data.result;
  } catch (error: any) {
    console.error('Error fetching subscription details:', error);
    throw new Error(error.response?.data?.errorMessages?.[0] || 'Không thể tải chi tiết subscription');
  }
};

/**
 * Hủy subscription
 */
export const cancelSubscription = async (subscriptionId: string): Promise<void> => {
  try {
    const response = await axiosClient.patch(`/subscription/${subscriptionId}/cancel`);
    
    if (!response.data.isSuccess) {
      throw new Error(response.data.errorMessages?.[0] || 'Không thể hủy subscription');
    }
  } catch (error: any) {
    console.error('Error cancelling subscription:', error);
    throw new Error(error.response?.data?.errorMessages?.[0] || 'Có lỗi xảy ra khi hủy subscription');
  }
};

/**
 * Bật/tắt auto renew
 */
export const toggleAutoRenew = async (subscriptionId: string, autoRenew: boolean): Promise<void> => {
  try {
    const response = await axiosClient.patch(`/subscription/${subscriptionId}/auto-renew`, {
      autoRenew
    });
    
    if (!response.data.isSuccess) {
      throw new Error(response.data.errorMessages?.[0] || 'Không thể cập nhật auto renew');
    }
  } catch (error: any) {
    console.error('Error toggling auto renew:', error);
    throw new Error(error.response?.data?.errorMessages?.[0] || 'Có lỗi xảy ra khi cập nhật auto renew');
  }
};

/**
 * Lấy lịch sử thanh toán subscription
 */
export const getSubscriptionPaymentHistory = async (): Promise<any[]> => {
  try {
    const response = await axiosClient.get('/subscription/payment-history');
    return response.data.result || [];
  } catch (error: any) {
    console.error('Error fetching payment history:', error);
    throw new Error(error.response?.data?.errorMessages?.[0] || 'Không thể tải lịch sử thanh toán');
  }
};

// Helper functions

/**
 * Format giá tiền
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

/**
 * Tính phần trăm giảm giá cho yearly plan
 */
export const calculateYearlyDiscount = (monthlyPrice: number, yearlyPrice: number): number => {
  const monthlyTotal = monthlyPrice * 12;
  const discount = ((monthlyTotal - yearlyPrice) / monthlyTotal) * 100;
  return Math.round(discount);
};

/**
 * Kiểm tra subscription có còn hiệu lực không
 */
export const isSubscriptionActive = (subscription: SubscriptionDTO): boolean => {
  return subscription.status === 'Active' && new Date(subscription.endDate) > new Date();
};

/**
 * Tính số ngày còn lại của subscription
 */
export const getDaysRemaining = (endDate: string): number => {
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

/**
 * Format ngày tháng theo định dạng Việt Nam
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Validate payment method
 */
export const validatePaymentMethod = (method: string): boolean => {
  return ['vnpay', 'momo'].includes(method.toLowerCase());
};

/**
 * Validate billing cycle
 */
export const validateBillingCycle = (cycle: string): boolean => {
  return ['Monthly', 'Yearly'].includes(cycle);
};

export default {
  getMembershipPlans,
  createPaymentUrl,
  getPaymentStatus,
  getUserSubscription,
  getSubscriptionById,
  cancelSubscription,
  toggleAutoRenew,
  getSubscriptionPaymentHistory,
  formatPrice,
  calculateYearlyDiscount,
  isSubscriptionActive,
  getDaysRemaining,
  formatDate,
  validatePaymentMethod,
  validateBillingCycle
};