import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

interface PaymentStatusCheckerProps {
  transactionRef?: string;
  onStatusChange?: (status: string, data?: any) => void;
}

const PaymentStatusChecker: React.FC<PaymentStatusCheckerProps> = ({ 
  transactionRef, 
  onStatusChange 
}) => {
  const [status, setStatus] = useState<'checking' | 'completed' | 'failed' | 'pending'>('checking');
  const [retryCount, setRetryCount] = useState(0);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!transactionRef) return;

    checkPaymentStatus();
    
    // Set up polling every 5 seconds for up to 2 minutes
    const interval = setInterval(() => {
      if (retryCount < 24) { // 24 * 5 = 120 seconds = 2 minutes
        checkPaymentStatus();
        setRetryCount(prev => prev + 1);
      } else {
        clearInterval(interval);
        setStatus('failed');
        onStatusChange?.('timeout');
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [transactionRef, retryCount]);

  useEffect(() => {
    if (status === 'checking' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCountdown(5);
    }
  }, [countdown, status]);

  const checkPaymentStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/subscription/payment/payment-status/${transactionRef}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.isSuccess) {
          const result = data.result;
          
          switch (result.status) {
            case 'Completed':
              setStatus('completed');
              onStatusChange?.('completed', result.subscription);
              break;
            case 'Failed':
              setStatus('failed');
              onStatusChange?.('failed', result.message);
              break;
            case 'Pending':
              setStatus('pending');
              setCountdown(5);
              break;
            default:
              setStatus('failed');
              onStatusChange?.('unknown', 'Trạng thái không xác định');
          }
        } else {
          setStatus('failed');
          onStatusChange?.('failed', data.errorMessages?.[0] || 'Có lỗi xảy ra');
        }
      } else {
        throw new Error('Network error');
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      if (retryCount >= 23) { // Last attempt
        setStatus('failed');
        onStatusChange?.('failed', 'Không thể kiểm tra trạng thái thanh toán');
      }
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <Loader2 className="w-8 h-8 animate-spin text-blue-600" />;
      case 'completed':
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'failed':
        return <XCircle className="w-8 h-8 text-red-600" />;
      case 'pending':
        return <Clock className="w-8 h-8 text-yellow-600" />;
      default:
        return <AlertTriangle className="w-8 h-8 text-gray-600" />;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'checking':
        return `Đang kiểm tra trạng thái thanh toán... (${countdown}s)`;
      case 'completed':
        return 'Thanh toán thành công! Đang chuyển hướng...';
      case 'failed':
        return 'Thanh toán thất bại hoặc bị hủy';
      case 'pending':
        return `Thanh toán đang được xử lý... Kiểm tra lại sau ${countdown}s`;
      default:
        return 'Trạng thái không xác định';
    }
  };

  const getProgressWidth = () => {
    if (status === 'completed') return '100%';
    if (status === 'failed') return '0%';
    
    const maxRetries = 24;
    const progress = Math.min((retryCount / maxRetries) * 100, 90);
    return `${progress}%`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          {/* Status Icon */}
          <div className="flex justify-center mb-6">
            {getStatusIcon()}
          </div>

          {/* Status Message */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Xử lý thanh toán
          </h2>
          <p className="text-gray-600 mb-6">
            {getStatusMessage()}
          </p>

          {/* Progress Bar */}
          {(status === 'checking' || status === 'pending') && (
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: getProgressWidth() }}
              ></div>
            </div>
          )}

          {/* Transaction Info */}
          {transactionRef && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">
                Mã giao dịch: <span className="font-mono">{transactionRef}</span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Lần thử: {retryCount + 1}/24
              </p>
            </div>
          )}

          {/* Action Buttons */}
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

          {/* Help Text */}
          {status === 'pending' && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                💡 Thanh toán có thể mất vài phút để xử lý. Vui lòng không đóng trang này.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusChecker;