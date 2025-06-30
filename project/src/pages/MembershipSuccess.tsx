// src/pages/MembershipSuccess.tsx
import React, { useEffect, useState } from 'react';
import { CheckCircle, Calendar, CreditCard, Download, ArrowRight } from 'lucide-react';

interface SubscriptionDetails {
  subscriptionId: number;
  planName: string;
  billingCycle: string;
  startDate: string;
  endDate: string;
  amount: number;
  paymentMethod: string;
  transactionRef: string;
}

const MembershipSuccess: React.FC = () => {
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubscriptionDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/subscription/user-subscription', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const result = await response.json();
        if (result.isSuccess && result.result) {
          setSubscription(result.result);
        }
      } catch (error) {
        console.error('Error loading subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSubscriptionDetails();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your subscription details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-600">
            Welcome to your new membership plan
          </p>
        </div>

        {/* Subscription Details */}
        {subscription && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Subscription Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Plan</label>
                  <p className="text-lg font-semibold text-gray-900">{subscription.planName}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Billing Cycle</label>
                  <p className="text-gray-900">{subscription.billingCycle}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Amount Paid</label>
                  <p className="text-lg font-semibold text-blue-600">
                    {subscription.amount.toLocaleString('vi-VN')} VND
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Start Date</label>
                  <p className="text-gray-900 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(subscription.startDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Valid Until</label>
                  <p className="text-gray-900 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(subscription.endDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Transaction ID</label>
                  <p className="text-gray-900 font-mono text-sm">{subscription.transactionRef}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            What's Next?
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-blue-600" />
              Your subscription is now active
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-blue-600" />
              You can now book consultations with doctors
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-blue-600" />
              Access premium features on your dashboard
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-blue-600" />
              Receive email confirmation with receipt
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
          
          <button
            onClick={() => window.location.href = '/appointments'}
            className="flex-1 border border-blue-600 text-blue-600 py-3 px-6 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center"
          >
            Book Consultation
            <Calendar className="w-5 h-5 ml-2" />
          </button>
        </div>

        {/* Support Info */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Need help? Contact our support team at</p>
          <a href="mailto:support@dochub.com" className="text-blue-600 hover:text-blue-800">
            support@dochub.com
          </a>
          <p className="mt-2">or call us at +84 123 456 789</p>
        </div>
      </div>
    </div>
  );
};

export default MembershipSuccess;

// src/api/vietqr.ts - API integration functions
export interface VietQRPaymentRequest {
  planId: number;
  billingCycle: 'Monthly' | 'Yearly';
}

export interface VietQRPaymentResponse {
  paymentRequestId: number;
  transferContent: string;
  amount: number;
  billingCycle: string;
  planName: string;
  expiresAt: string;
  expiresInMinutes: number;
  accountNo: string;
  accountName: string;
  bankCode: string;
  bankName: string;
  qrCodeBase64?: string;
  qrCodeUrl?: string;
}

export interface PaymentStatusResponse {
  transferContent: string;
  status: 'Pending' | 'Confirmed' | 'Expired';
  amount: number;
  planName: string;
  createdAt: string;
  expiresAt: string;
  confirmedAt?: string;
  isExpired: boolean;
}

// API functions
export const createVietQRPayment = async (request: VietQRPaymentRequest): Promise<VietQRPaymentResponse> => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/subscription/VietQRPayment/create-payment-request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(request)
  });

  const result = await response.json();
  
  if (!result.isSuccess) {
    throw new Error(result.errorMessages?.[0] || 'Failed to create payment request');
  }

  return result.result;
};

export const checkPaymentStatus = async (transferContent: string): Promise<PaymentStatusResponse> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`/api/subscription/VietQRPayment/check-status/${encodeURIComponent(transferContent)}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const result = await response.json();
  
  if (!result.isSuccess) {
    throw new Error(result.errorMessages?.[0] || 'Failed to check payment status');
  }

  return result.result;
};

// Admin API functions
export interface SearchPaymentRequestsParams {
  transferContent?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface PaymentRequestListItem {
  paymentRequestId: number;
  transferContent: string;
  userName: string;
  userEmail: string;
  planName: string;
  amount: number;
  billingCycle: string;
  status: string;
  createdAt: string;
  expiresAt: string;
  confirmedAt?: string;
  confirmedBy?: string;
  isExpired: boolean;
}

export interface PaginatedPaymentRequests {
  paymentRequests: PaymentRequestListItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export const searchPaymentRequests = async (params: SearchPaymentRequestsParams): Promise<PaginatedPaymentRequests> => {
  const token = localStorage.getItem('token');
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value.toString());
    }
  });

  const response = await fetch(`/api/admin/PaymentManagement/payment-requests?${queryParams}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const result = await response.json();
  
  if (!result.isSuccess) {
    throw new Error(result.errorMessages?.[0] || 'Failed to search payment requests');
  }

  return result.result;
};

export const confirmPayment = async (paymentRequestId: number, notes?: string) => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/admin/PaymentManagement/confirm-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      paymentRequestId,
      notes
    })
  });

  const result = await response.json();
  
  if (!result.isSuccess) {
    throw new Error(result.errorMessages?.[0] || 'Failed to confirm payment');
  }

  return result.result;
};