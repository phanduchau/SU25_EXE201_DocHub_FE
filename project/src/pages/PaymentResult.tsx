import React, { useEffect, useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Crown, 
  Calendar,
  ArrowRight,
  Loader2,
  Home,
  User,
  RefreshCw
} from 'lucide-react';

// Success Page Component
const PaymentSuccessPage: React.FC = () => {
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Get subscription ID from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const subscriptionId = urlParams.get('subscriptionId');
    
    if (subscriptionId) {
      fetchSubscriptionDetails(subscriptionId);
    } else {
      // Try to get from pending payment
      checkPendingPayment();
    }
  }, []);

  const fetchSubscriptionDetails = async (subscriptionId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập để xem thông tin');
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/subscription/user-subscription`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.isSuccess && data.result) {
          setSubscriptionData(data.result);
          // Clear pending payment since it's successful
          localStorage.removeItem('pendingPayment');
        } else {
          setError('Không thể tải thông tin subscription');
        }
      } else if (response.status === 401) {
        setError('Phiên đăng nhập đã hết hạn');
        localStorage.removeItem('token');
        setTimeout(() => window.location.href = '/login', 2000);
      } else {
        setError('Có lỗi xảy ra khi tải thông tin');
      }
    } catch (error) {
      console.error('Error fetching subscription details:', error);
      setError('Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const checkPendingPayment = () => {
    try {
      const pendingPayment = localStorage.getItem('pendingPayment');
      if (pendingPayment) {
        const paymentInfo = JSON.parse(pendingPayment);
        setSubscriptionData({
          planName: paymentInfo.planName,
          amount: paymentInfo.amount,
          billingCycle: paymentInfo.billingCycle,
          startDate: new Date().toISOString(),
          endDate: paymentInfo.billingCycle === 'Yearly' 
            ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          subscriptionId: paymentInfo.transactionRef || 'PENDING'
        });
        localStorage.removeItem('pendingPayment');
      } else {
        setError('Không tìm thấy thông tin thanh toán');
      }
    } catch (error) {
      setError('Lỗi xử lý thông tin thanh toán');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin subscription...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/membership'}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Thử lại
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-gray-100 text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-200"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Thanh toán thành công! 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Chúc mừng! Bạn đã đăng ký membership thành công. Tài khoản của bạn đã được nâng cấp.
          </p>

          {/* Subscription Details */}
          {subscriptionData && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center mb-4">
                <Crown className="w-8 h-8 text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Gói {subscriptionData.planName}
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã subscription:</span>
                    <span className="font-medium">{subscriptionData.subscriptionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chu kỳ thanh toán:</span>
                    <span className="font-medium">
                      {subscriptionData.billingCycle === 'Monthly' ? 'Hàng tháng' : 'Hàng năm'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phương thức:</span>
                    <span className="font-medium">{subscriptionData.paymentMethod}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngày bắt đầu:</span>
                    <span className="font-medium">{formatDate(subscriptionData.startDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngày hết hạn:</span>
                    <span className="font-medium">{formatDate(subscriptionData.endDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số tiền:</span>
                    <span className="font-bold text-green-600">
                      {formatPrice(subscriptionData.amount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Benefits */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Quyền lợi bạn nhận được:
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <span>Đặt lịch hẹn ưu tiên</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <span>Chat không giới hạn với bác sĩ</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <span>Video call tư vấn</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <span>Báo cáo sức khỏe chi tiết</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Bước tiếp theo:
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                <span>Đặt lịch hẹn đầu tiên với bác sĩ</span>
              </div>
              <div className="flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600 mr-3" />
                <span>Cập nhật thông tin hồ sơ y tế</span>
              </div>
              <div className="flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-3" />
                <span>Kiểm tra email xác nhận đã gửi</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/appointments'}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all flex items-center justify-center"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Đặt lịch hẹn ngay
            </button>
            <button 
              onClick={() => window.location.href = '/profile'}
              className="bg-gray-100 text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center justify-center"
            >
              <User className="w-5 h-5 mr-2" />
              Xem hồ sơ
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-white text-gray-600 px-8 py-3 rounded-lg font-medium border hover:bg-gray-50 transition-all flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Về trang chủ
            </button>
          </div>

          {/* Email Notice */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              📧 Email xác nhận đã được gửi đến hộp thư của bạn. Vui lòng kiểm tra để biết thêm chi tiết.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Failed Page Component
const PaymentFailedPage: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    setErrorMessage(error || 'Có lỗi xảy ra trong quá trình thanh toán');
  }, []);

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'user_cancel':
        return 'Bạn đã hủy bỏ giao dịch';
      case 'insufficient_balance':
        return 'Số dư tài khoản không đủ';
      case 'invalid_card':
        return 'Thông tin thẻ không hợp lệ';
      case 'expired_card':
        return 'Thẻ đã hết hạn';
      case 'system_error':
        return 'Lỗi hệ thống, vui lòng thử lại sau';
      case 'payment_timeout':
        return 'Giao dịch hết thời gian chờ';
      default:
        return 'Thanh toán không thành công';
    }
  };

  const handleRetryPayment = () => {
    window.location.href = '/membership';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Error Icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>

          {/* Error Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Thanh toán thất bại
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            {getErrorMessage(errorMessage)}
          </p>
          <p className="text-gray-500 mb-8">
            Đừng lo lắng, bạn có thể thử lại hoặc chọn phương thức thanh toán khác.
          </p>

          {/* Error Details */}
          <div className="bg-red-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-bold text-red-900 mb-4">
              Chi tiết lỗi:
            </h3>
            <p className="text-red-800">{errorMessage}</p>
          </div>

          {/* Troubleshooting */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Cách khắc phục:
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                <span>Kiểm tra số dư tài khoản hoặc thông tin thẻ</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                <span>Thử phương thức thanh toán khác (VNPay/MoMo)</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                <span>Kiểm tra kết nối internet</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                <span>Liên hệ ngân hàng nếu thẻ bị khóa</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleRetryPayment}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all flex items-center justify-center"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Thử lại thanh toán
            </button>
            <button 
              onClick={() => window.location.href = '/contact'}
              className="bg-gray-100 text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all"
            >
              Liên hệ hỗ trợ
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-white text-gray-600 px-8 py-3 rounded-lg font-medium border hover:bg-gray-50 transition-all flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Về trang chủ
            </button>
          </div>

          {/* Support Info */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">
              💬 Cần hỗ trợ? Liên hệ hotline: <strong>1900-1234</strong> hoặc email: <strong>support@dochub.vn</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component - Payment Result Router
const PaymentResultPage: React.FC = () => {
  const [pageType, setPageType] = useState<'success' | 'failed' | 'loading'>('loading');

  useEffect(() => {
    // Determine page type based on URL
    const path = window.location.pathname;
    if (path.includes('/subscription/success')) {
      setPageType('success');
    } else if (path.includes('/subscription/failed')) {
      setPageType('failed');
    } else {
      setPageType('success'); // Default to success for demo
    }
  }, []);

  if (pageType === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return pageType === 'success' ? <PaymentSuccessPage /> : <PaymentFailedPage />;
};

export default PaymentResultPage;