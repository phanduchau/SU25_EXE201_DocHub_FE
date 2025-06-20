import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

// Simple Payment Status Page Component
const PaymentStatusPage: React.FC = () => {
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [status, setStatus] = useState<'checking' | 'success' | 'failed'>('checking');
  const [message, setMessage] = useState<string>('Đang kiểm tra trạng thái thanh toán...');

  useEffect(() => {
    // Get transaction ref from URL params or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const txnRef = urlParams.get('txnRef') || urlParams.get('transactionRef');
    
    if (txnRef) {
      setTransactionRef(txnRef);
      checkPaymentStatus(txnRef);
    } else {
      // Try to get from localStorage
      const pendingPayment = localStorage.getItem('pendingPayment');
      if (pendingPayment) {
        try {
          const paymentInfo = JSON.parse(pendingPayment);
          if (paymentInfo.transactionRef) {
            setTransactionRef(paymentInfo.transactionRef);
            checkPaymentStatus(paymentInfo.transactionRef);
          } else {
            setStatus('failed');
            setMessage('Không tìm thấy thông tin giao dịch');
          }
        } catch (error) {
          console.error('Error parsing pending payment:', error);
          setStatus('failed');
          setMessage('Lỗi xử lý thông tin thanh toán');
        }
      } else {
        setStatus('failed');
        setMessage('Không tìm thấy thông tin giao dịch');
      }
    }
  }, []);

  const checkPaymentStatus = async (txnRef: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setStatus('failed');
        setMessage('Vui lòng đăng nhập để kiểm tra trạng thái');
        return;
      }

      const response = await fetch(`/api/subscription/payment/payment-status/${txnRef}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.isSuccess && data.result) {
          const result = data.result;
          
          switch (result.status) {
            case 'Completed':
              setStatus('success');
              setMessage('Thanh toán thành công!');
              localStorage.removeItem('pendingPayment');
              
              // Redirect to success page after 2 seconds
              setTimeout(() => {
                if (result.subscription) {
                  window.location.href = `/subscription/success?subscriptionId=${result.subscription.subscriptionId}`;
                } else {
                  window.location.href = '/subscription/success';
                }
              }, 2000);
              break;
              
            case 'Failed':
              setStatus('failed');
              setMessage(result.message || 'Thanh toán thất bại');
              setTimeout(() => {
                window.location.href = `/subscription/failed?error=${encodeURIComponent(result.message || 'payment_failed')}`;
              }, 3000);
              break;
              
            case 'Pending':
              setMessage('Thanh toán đang được xử lý...');
              // Retry after 3 seconds
              setTimeout(() => checkPaymentStatus(txnRef), 3000);
              break;
              
            default:
              setStatus('failed');
              setMessage('Trạng thái thanh toán không xác định');
          }
        } else {
          setStatus('failed');
          setMessage(data.errorMessages?.[0] || 'Có lỗi xảy ra khi kiểm tra trạng thái');
        }
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error: unknown) {
      console.error('Error checking payment status:', error);
      setStatus('failed');
      if (error instanceof Error) {
        setMessage(`Lỗi kiểm tra trạng thái: ${error.message}`);
      } else {
        setMessage('Không thể kiểm tra trạng thái thanh toán');
      }
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <Loader2 className="w-12 h-12 animate-spin text-blue-600" />;
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-600" />;
      case 'failed':
        return <XCircle className="w-12 h-12 text-red-600" />;
      default:
        return <Loader2 className="w-12 h-12 animate-spin text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'checking':
        return 'from-blue-50 to-indigo-100';
      case 'success':
        return 'from-green-50 to-emerald-100';
      case 'failed':
        return 'from-red-50 to-pink-100';
      default:
        return 'from-gray-50 to-gray-100';
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getStatusColor()} flex items-center justify-center`}>
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            {getStatusIcon()}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Xử lý thanh toán
          </h2>
          
          <p className="text-gray-600 mb-6">
            {message}
          </p>
          
          {transactionRef && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">
                Mã giao dịch: <span className="font-mono text-xs">{transactionRef}</span>
              </p>
            </div>
          )}
          
          {status === 'failed' && (
            <div className="flex gap-4">
              <button
                onClick={() => window.location.href = '/membership'}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-all"
              >
                Thử lại
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 bg-gray-100 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all"
              >
                Về trang chủ
              </button>
            </div>
          )}
          
          {status === 'checking' && (
            <div className="text-sm text-gray-500">
              Vui lòng không đóng trang này...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Simple URL Handler Component
const URLHandler: React.FC = () => {
  useEffect(() => {
    const currentPath = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);

    // Handle VNPay callback
    if (currentPath.includes('/vnpay-return') || urlParams.get('vnp_ResponseCode')) {
      const responseCode = urlParams.get('vnp_ResponseCode');
      
      if (responseCode === '00') {
        // Success - redirect to payment status checker
        const txnRef = urlParams.get('vnp_TxnRef');
        if (txnRef) {
          window.location.href = `/payment/status?transactionRef=${txnRef}`;
        } else {
          window.location.href = '/subscription/success';
        }
      } else {
        // Failed - redirect to failed page
        window.location.href = `/subscription/failed?error=vnpay_error&code=${responseCode}`;
      }
      return;
    }

    // Handle MoMo callback
    if (currentPath.includes('/momo-return') || urlParams.get('resultCode')) {
      const resultCode = urlParams.get('resultCode');
      
      if (resultCode === '0') {
        // Success - redirect to payment status checker
        const orderId = urlParams.get('orderId');
        if (orderId) {
          window.location.href = `/payment/status?transactionRef=${orderId}`;
        } else {
          window.location.href = '/subscription/success';
        }
      } else {
        // Failed - redirect to failed page
        window.location.href = `/subscription/failed?error=momo_error&code=${resultCode}`;
      }
      return;
    }

    // Handle membership activation from email links
    const membershipActivated = urlParams.get('membership_activated');
    const planName = urlParams.get('plan');
    
    if (membershipActivated === 'true' && planName) {
      // Show success message
      alert(`🎉 Gói ${planName} đã được kích hoạt thành công!`);
      
      // Clean URL and redirect
      window.history.replaceState({}, document.title, window.location.pathname);
      setTimeout(() => {
        window.location.href = '/subscription/status';
      }, 2000);
    }
  }, []);

  return null;
};

// Main Membership App Component
const MembershipApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    try {
      const path = window.location.pathname;
      
      if (path.includes('/payment/status')) {
        setCurrentPage('payment-status');
      } else if (path.includes('/subscription/success')) {
        setCurrentPage('success');
      } else if (path.includes('/subscription/failed')) {
        setCurrentPage('failed');
      } else if (path.includes('/subscription/status') || path.includes('/subscription/manage')) {
        setCurrentPage('status');
      } else if (path.includes('/membership')) {
        setCurrentPage('membership');
      } else {
        setCurrentPage('membership');
      }
    } catch (err) {
      console.error('Error determining page:', err);
      setError('Có lỗi xảy ra khi tải trang');
      setCurrentPage('error');
    }
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'payment-status':
        return <PaymentStatusPage />;
        
      case 'success':
        return (
          <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Thanh toán thành công!</h2>
              <p className="text-gray-600 mb-6">Gói membership của bạn đã được kích hoạt.</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => window.location.href = '/subscription/status'}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
                >
                  Xem chi tiết
                </button>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="flex-1 bg-gray-100 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-200"
                >
                  Về trang chủ
                </button>
              </div>
            </div>
          </div>
        );
        
      case 'failed':
        const urlParams = new URLSearchParams(window.location.search);
        const errorMessage = urlParams.get('error') || 'Thanh toán thất bại';
        
        return (
          <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
              <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Thanh toán thất bại</h2>
              <p className="text-gray-600 mb-6">{decodeURIComponent(errorMessage)}</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => window.location.href = '/membership'}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
                >
                  Thử lại
                </button>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="flex-1 bg-gray-100 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-200"
                >
                  Về trang chủ
                </button>
              </div>
            </div>
          </div>
        );
        
      case 'status':
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Quản lý Membership</h2>
              <p className="text-gray-600 mb-6">Trang quản lý membership sẽ được hiển thị ở đây.</p>
              <button 
                onClick={() => window.location.href = '/membership'}
                className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700"
              >
                Về trang membership
              </button>
            </div>
          </div>
        );
        
      case 'membership':
        return (
          <div className="min-h-screen bg-teal-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Chọn Gói Membership</h2>
              <p className="text-gray-600 mb-6">Trang chọn gói membership sẽ được hiển thị ở đây.</p>
              <button 
                onClick={() => window.location.href = '/'}
                className="bg-teal-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-teal-700"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        );
        
      case 'error':
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
              <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Có lỗi xảy ra</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700"
              >
                Tải lại trang
              </button>
            </div>
          </div>
        );
        
      case 'loading':
      default:
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Đang tải...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="membership-app">
      {/* URL Handler for callbacks */}
      <URLHandler />
      
      {/* Current Page */}
      {renderPage()}
    </div>
  );
};

// Utility functions for external use
export const membershipUtils = {
  // Check if user has active subscription
  checkActiveSubscription: async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      const response = await fetch('/api/subscription/user-subscription', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        return data.isSuccess && data.result && data.result.status === 'Active';
      }
      return false;
    } catch (error) {
      console.error('Error checking subscription:', error);
      return false;
    }
  },

  // Get user subscription details
  getUserSubscription: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const response = await fetch('/api/subscription/user-subscription', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        return data.isSuccess ? data.result : null;
      }
      return null;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }
  },

  // Redirect to membership page if no active subscription
  requireActiveSubscription: async (redirectUrl: string = '/membership'): Promise<boolean> => {
    const hasSubscription = await membershipUtils.checkActiveSubscription();
    if (!hasSubscription) {
      window.location.href = redirectUrl;
      return false;
    }
    return true;
  },

  // Format price to VND
  formatPrice: (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  },

  // Calculate yearly discount
  calculateYearlyDiscount: (monthlyPrice: number, yearlyPrice: number): number => {
    const monthlyTotal = monthlyPrice * 12;
    const discount = ((monthlyTotal - yearlyPrice) / monthlyTotal) * 100;
    return Math.round(discount);
  }
};

export default MembershipApp;