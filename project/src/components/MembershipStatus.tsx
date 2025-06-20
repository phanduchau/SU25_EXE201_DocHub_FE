import React, { useState } from 'react';
import { 
  Crown, 
  Calendar, 
  CreditCard, 
  Settings, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Star,
  Shield,
  Plus,
  Loader2
} from 'lucide-react';

// Types
interface SubscriptionData {
  subscriptionId: string;
  planName: string;
  status: 'Active' | 'Expired' | 'Cancelled';
  billingCycle: 'Monthly' | 'Yearly';
  amount: number;
  paymentMethod: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}

// Mock hook - replace with actual useMembership hook
const useMembership = () => {
  const [currentSubscription, setCurrentSubscription] = useState<SubscriptionData | null>({
    subscriptionId: 'SUB_123456',
    planName: 'Premium',
    status: 'Active',
    billingCycle: 'Monthly',
    amount: 399000,
    paymentMethod: 'VNPay',
    startDate: '2025-01-15T00:00:00Z',
    endDate: '2025-02-15T00:00:00Z',
    autoRenew: true
  });
  
  const [loading, setLoading] = useState(false);
  
  const updateAutoRenew = async (subscriptionId: string, autoRenew: boolean) => {
    setLoading(true);
    // Mock API call
    setTimeout(() => {
      if (currentSubscription) {
        setCurrentSubscription({...currentSubscription, autoRenew});
      }
      setLoading(false);
    }, 1000);
  };
  
  const cancelUserSubscription = async (subscriptionId: string) => {
    setLoading(true);
    setTimeout(() => {
      if (currentSubscription) {
        setCurrentSubscription({...currentSubscription, status: 'Cancelled'});
      }
      setLoading(false);
    }, 1000);
  };
  
  return {
    currentSubscription,
    loading,
    updateAutoRenew,
    cancelUserSubscription
  };
};

const MembershipStatusComponent: React.FC = () => {
  const { currentSubscription, loading, updateAutoRenew, cancelUserSubscription } = useMembership();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-1" />
            Đang hoạt động
          </span>
        );
      case 'Expired':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <XCircle className="w-4 h-4 mr-1" />
            Đã hết hạn
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            <XCircle className="w-4 h-4 mr-1" />
            Đã hủy
          </span>
        );
      default:
        return null;
    }
  };

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'premium':
        return <Star className="w-6 h-6 text-purple-600" />;
      case 'vip':
        return <Crown className="w-6 h-6 text-yellow-600" />;
      default:
        return <User className="w-6 h-6 text-blue-600" />;
    }
  };

  const handleAutoRenewToggle = async () => {
    if (currentSubscription) {
      await updateAutoRenew(currentSubscription.subscriptionId, !currentSubscription.autoRenew);
    }
  };

  const handleCancelSubscription = async () => {
    if (currentSubscription) {
      await cancelUserSubscription(currentSubscription.subscriptionId);
      setShowCancelModal(false);
    }
  };

  // No subscription state
  if (!currentSubscription) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Crown className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Chưa có gói membership
          </h2>
          <p className="text-gray-600 mb-6">
            Nâng cấp tài khoản để trải nghiệm đầy đủ các tính năng premium
          </p>
          <button 
            onClick={() => window.location.href = '/membership'}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all flex items-center justify-center mx-auto"
          >
            <Plus className="w-5 h-5 mr-2" />
            Chọn gói membership
          </button>
        </div>
      </div>
    );
  }

  const daysRemaining = getDaysRemaining(currentSubscription.endDate);
  const isExpiringSoon = daysRemaining <= 7 && currentSubscription.status === 'Active';

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Main Subscription Card */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="mr-4">
              {getPlanIcon(currentSubscription.planName)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gói {currentSubscription.planName}
              </h1>
              <div className="flex items-center mt-2">
                {getStatusBadge(currentSubscription.status)}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">
              {formatPrice(currentSubscription.amount)}
            </div>
            <div className="text-gray-600">
              /{currentSubscription.billingCycle === 'Monthly' ? 'tháng' : 'năm'}
            </div>
          </div>
        </div>

        {/* Expiration Warning */}
        {isExpiringSoon && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
              <div>
                <p className="font-medium text-yellow-800">
                  Gói membership sắp hết hạn
                </p>
                <p className="text-yellow-700">
                  Chỉ còn {daysRemaining} ngày. {!currentSubscription.autoRenew && 'Vui lòng gia hạn để tiếp tục sử dụng dịch vụ.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Details Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Mã subscription:</span>
              <span className="font-medium">{currentSubscription.subscriptionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ngày bắt đầu:</span>
              <span className="font-medium">{formatDate(currentSubscription.startDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ngày hết hạn:</span>
              <span className="font-medium">{formatDate(currentSubscription.endDate)}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Phương thức thanh toán:</span>
              <span className="font-medium">{currentSubscription.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Chu kỳ thanh toán:</span>
              <span className="font-medium">
                {currentSubscription.billingCycle === 'Monthly' ? 'Hàng tháng' : 'Hàng năm'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Còn lại:</span>
              <span className="font-medium">{daysRemaining} ngày</span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Settings className="w-6 h-6 mr-3" />
          Cài đặt subscription
        </h2>

        <div className="space-y-6">
          {/* Auto Renew Setting */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <RefreshCw className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Gia hạn tự động</h3>
                <p className="text-sm text-gray-600">
                  Tự động gia hạn subscription khi hết hạn
                </p>
              </div>
            </div>
            <button
              onClick={handleAutoRenewToggle}
              disabled={loading || currentSubscription.status !== 'Active'}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                currentSubscription.autoRenew ? 'bg-blue-600' : 'bg-gray-200'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  currentSubscription.autoRenew ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Upgrade/Downgrade */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Crown className="w-5 h-5 text-purple-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Thay đổi gói</h3>
                <p className="text-sm text-gray-600">
                  Nâng cấp hoặc hạ cấp gói membership
                </p>
              </div>
            </div>
            <button 
              onClick={() => window.location.href = '/membership'}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-all"
            >
              Thay đổi
            </button>
          </div>

          {/* Payment History */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <CreditCard className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Lịch sử thanh toán</h3>
                <p className="text-sm text-gray-600">
                  Xem tất cả giao dịch thanh toán
                </p>
              </div>
            </div>
            <button 
              onClick={() => window.location.href = '/subscription/history'}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-all"
            >
              Xem lịch sử
            </button>
          </div>

          {/* Cancel Subscription */}
          {currentSubscription.status === 'Active' && (
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 text-red-600 mr-3" />
                <div>
                  <h3 className="font-medium text-red-900">Hủy subscription</h3>
                  <p className="text-sm text-red-700">
                    Hủy gói membership hiện tại
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowCancelModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-all"
              >
                Hủy gói
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Xác nhận hủy subscription
              </h3>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn hủy gói {currentSubscription.planName}? 
                Bạn sẽ mất quyền truy cập vào các tính năng premium.
              </p>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 bg-gray-100 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all"
                >
                  Giữ lại
                </button>
                <button
                  onClick={handleCancelSubscription}
                  disabled={loading}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Xác nhận hủy'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipStatusComponent;