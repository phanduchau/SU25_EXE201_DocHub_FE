// Complete VietQRPayment.tsx component - the missing parts
import React, { useState, useEffect } from 'react';
import { QrCode, Clock, Copy, CheckCircle, AlertCircle, CreditCard, RefreshCw, Download, X, Search, FileText } from 'lucide-react';
import {
  createVietQRPayment,
  getVietQRPaymentStatus,
  CreateVietQRPaymentRequest,
  VietQRPaymentResponse,
  PaymentRequestStatus,
  VietQRUtils
} from '../apis/vietqr/vietqrApi';

interface VietQRPaymentProps {
  planId: number;
  planName: string;
  amount: number;
  billingCycle: 'Monthly' | 'Yearly';
  onSuccess?: () => void;
  onCancel?: () => void;
}

const VietQRPayment: React.FC<VietQRPaymentProps> = ({
  planId,
  planName,
  amount,
  billingCycle,
  onSuccess,
  onCancel
}) => {
  const [paymentData, setPaymentData] = useState<VietQRPaymentResponse | null>(null);
  const [status, setStatus] = useState<'creating' | 'pending' | 'checking' | 'confirmed' | 'expired' | 'error'>('creating');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<string>('');
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (paymentData && status === 'pending') {
      // Start countdown timer
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const expiry = new Date(paymentData.expiresAt).getTime();
        const timeLeft = expiry - now;

        if (timeLeft <= 0) {
          setTimeLeft(0);
          setStatus('expired');
          clearInterval(timer);
        } else {
          setTimeLeft(Math.floor(timeLeft / 1000));
        }
      }, 1000);

      // Start status checking
      const statusChecker = setInterval(async () => {
        try {
          const statusData = await getVietQRPaymentStatus(paymentData.paymentRequestId);
          if (statusData.status === 'Confirmed') {
            setStatus('confirmed');
            clearInterval(statusChecker);
            clearInterval(timer);
            if (onSuccess) onSuccess();
          } else if (statusData.status === 'Expired') {
            setStatus('expired');
            clearInterval(statusChecker);
            clearInterval(timer);
          }
        } catch (error) {
          console.error('Error checking payment status:', error);
        }
      }, 10000); // Check every 10 seconds

      return () => {
        clearInterval(timer);
        clearInterval(statusChecker);
      };
    }
  }, [paymentData, status, onSuccess]);

  const createPaymentRequest = async () => {

    if (isCreating) return;

    try {
      setIsCreating(true);
      setStatus('creating');
      setError('');

      const request: CreateVietQRPaymentRequest = {
        planId,
        billingCycle
      };

      const data = await createVietQRPayment(request);
      setPaymentData(data);
      setStatus('pending');
      setTimeLeft(data.expiresInMinutes * 60);
    } catch (error: any) {
      setError(error.message);
      setStatus('error');
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    const success = await VietQRUtils.copyToClipboardWithFallback(text);
    if (success) {
      setCopied(type);
      setTimeout(() => setCopied(''), 2000);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const downloadQRCode = () => {
    if (paymentData?.qrCodeUrl) {
      const link = document.createElement('a');
      link.href = paymentData.qrCodeUrl;
      link.download = `QR_${paymentData.transferCode}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Loading state
  if (status === 'creating') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Đang tạo yêu cầu thanh toán...</h3>
          <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  // Error state
  if (status === 'error') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-600 mb-2">Có lỗi xảy ra</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={createPaymentRequest}
              disabled={isCreating}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Đang tạo...' : 'Thử lại'}
            </button>
            {onCancel && (
              <button
                onClick={onCancel}
                disabled={isCreating}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (status === 'confirmed') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-600 mb-2">Thanh toán thành công!</h3>
          <p className="text-gray-600 mb-4">
            Tài khoản của bạn đã được nâng cấp thành công.
          </p>
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-green-700">
              <strong>Gói:</strong> {paymentData?.planName}<br />
              <strong>Mã giao dịch:</strong> {paymentData?.transferCode}
            </p>
          </div>
          <button
            onClick={onSuccess}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            Tiếp tục
          </button>
        </div>
      </div>
    );
  }

  // Expired state
  if (status === 'expired') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <Clock className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-orange-600 mb-2">Hết thời gian thanh toán</h3>
          <p className="text-gray-600 mb-4">
            Yêu cầu thanh toán đã hết hạn. Vui lòng tạo yêu cầu mới.
          </p>
          <div className="flex gap-3">
            <button
              onClick={createPaymentRequest}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tạo mới
            </button>
            {onCancel && (
              <button
                onClick={onCancel}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!paymentData) return null;

  // Main payment interface
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <QrCode className="w-8 h-8 text-blue-600 mx-auto mb-2" />
        <h3 className="text-lg font-semibold">Quét mã QR để thanh toán</h3>
        <p className="text-gray-600">Sử dụng ứng dụng ngân hàng để quét mã</p>
      </div>

      {/* Countdown Timer */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-center gap-2">
          <Clock className="w-4 h-4 text-orange-600" />
          <span className="text-orange-700 font-medium">
            Còn lại: {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* QR Code */}
      <div className="text-center mb-6">
        <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg relative">
          {paymentData.qrCodeUrl.startsWith('data:image/svg') ? (
            // Fallback SVG QR code
            <div
              className="w-48 h-48 mx-auto flex items-center justify-center bg-gray-50 border border-gray-300 rounded"
              dangerouslySetInnerHTML={{
                __html: atob(paymentData.qrCodeUrl.split(',')[1])
              }}
            />
          ) : (
            // Real VietQR code
            <img
              src={paymentData.qrCodeUrl}
              alt="QR Code"
              className="w-48 h-48 mx-auto"
              onError={(e) => {
                console.error('QR Code image failed to load');
                // Fallback to showing transfer details
                e.currentTarget.style.display = 'none';
              }}
            />
          )}

          <button
            onClick={downloadQRCode}
            className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-all"
            title="Tải xuống QR code"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

        {/* QR Code Type Indicator */}
        <div className="mt-2 text-xs text-gray-500">
          {paymentData.qrCodeUrl.startsWith('data:image/svg') ? (
            <span className="text-orange-600">⚠️ QR code dự phòng - Vui lòng chuyển khoản thủ công</span>
          ) : (
            <span className="text-green-600">✅ QR code VietQR - Quét để thanh toán</span>
          )}
        </div>
      </div>

      {/* Payment Information */}
      <div className="space-y-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Thông tin thanh toán</h4>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Gói dịch vụ:</span>
              <span className="font-medium">{paymentData.planName}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Chu kỳ:</span>
              <span className="font-medium">
                {paymentData.billingCycle === 'Monthly' ? 'Hàng tháng' : 'Hàng năm'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Số tiền:</span>
              <span className="font-medium text-lg text-blue-600">
                {VietQRUtils.formatVietnamCurrency(paymentData.amount)}
              </span>
            </div>
          </div>
        </div>

        {/* Bank Information */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-blue-900">Thông tin tài khoản</h4>
            <button
              onClick={() => setShowBankDetails(!showBankDetails)}
              className="text-blue-600 text-sm hover:text-blue-700"
            >
              {showBankDetails ? 'Ẩn' : 'Hiện'} chi tiết
            </button>
          </div>

          {showBankDetails && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-blue-700">Ngân hàng:</span>
                <span className="font-medium">{paymentData.bankAccount.bankName}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-blue-700">Số tài khoản:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium">{paymentData.bankAccount.accountNo}</span>
                  <button
                    onClick={() => copyToClipboard(paymentData.bankAccount.accountNo, 'account')}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                  >
                    {copied === 'account' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-blue-700">Chủ tài khoản:</span>
                <span className="font-medium">{paymentData.bankAccount.accountName}</span>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-3 pt-3 border-t border-blue-200">
            <span className="text-blue-700 font-medium">Nội dung CK:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-medium text-red-600">{paymentData.transferCode}</span>
              <button
                onClick={() => copyToClipboard(paymentData.transferCode, 'code')}
                className="p-1 text-blue-600 hover:bg-blue-100 rounded"
              >
                {copied === 'code' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
        <h5 className="font-medium text-yellow-800 mb-2">⚠️ Lưu ý quan trọng:</h5>
        <ul className="text-yellow-800 text-xs space-y-1">
          <li>• Chuyển khoản đúng số tiền: <strong>{VietQRUtils.formatVietnamCurrency(paymentData.amount)}</strong></li>
          <li>• Nhập đúng nội dung: <strong>{paymentData.transferCode}</strong></li>
          <li>• Thanh toán trong vòng <strong>15 phút</strong></li>
          <li>• Giữ lại ảnh chụp màn hình để đối chiếu</li>
        </ul>
      </div>

      {/* Status */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-blue-600 mb-4">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span className="text-sm">Đang chờ thanh toán...</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => window.location.reload()}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            Làm mới
          </button>

          {onCancel && (
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              Hủy
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VietQRPayment;

// PaymentStatusChecker.tsx - Component to check payment status by transfer code
interface PaymentStatusCheckerProps {
  onPaymentFound?: (payment: PaymentRequestStatus) => void;
}

const PaymentStatusChecker: React.FC<PaymentStatusCheckerProps> = ({ onPaymentFound }) => {
  const [transferCode, setTransferCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PaymentRequestStatus | null>(null);
  const [error, setError] = useState('');

  const checkStatus = async () => {
    if (!transferCode.trim()) {
      setError('Vui lòng nhập mã chuyển khoản');
      return;
    }

    if (!VietQRUtils.verifyTransferCode(transferCode)) {
      setError('Mã chuyển khoản không đúng định dạng');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // This would need a new API endpoint to check by transfer code
      // For now, we'll simulate the check
      const response = await fetch(`/api/vietqr-payment/check-status/${transferCode}`);
      const data = await response.json();

      if (data.isSuccess) {
        setResult(data.result);
        if (onPaymentFound) {
          onPaymentFound(data.result);
        }
      } else {
        setError('Không tìm thấy yêu cầu thanh toán');
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi kiểm tra trạng thái');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Kiểm tra trạng thái thanh toán</h3>
        <p className="text-gray-600 text-sm">Nhập mã chuyển khoản để kiểm tra trạng thái</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mã chuyển khoản
          </label>
          <input
            type="text"
            value={transferCode}
            onChange={(e) => setTransferCode(e.target.value.toUpperCase())}
            placeholder="TVIP-XXXXXX-DDMMMYYYY-XXX"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium mb-2">Kết quả kiểm tra:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Trạng thái:</span>
                <span className="font-medium">{result.status}</span>
              </div>
              <div className="flex justify-between">
                <span>Số tiền:</span>
                <span className="font-medium">{VietQRUtils.formatVietnamCurrency(result.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Ngày tạo:</span>
                <span>{VietQRUtils.formatVietnameseDate(result.createdAt)}</span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={checkStatus}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Đang kiểm tra...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Kiểm tra
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export { PaymentStatusChecker };

// QuickPaymentActions.tsx - Quick actions for common payment tasks
const QuickPaymentActions: React.FC = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [showStatusChecker, setShowStatusChecker] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <button
        onClick={() => setShowHistory(true)}
        className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
      >
        <FileText className="w-6 h-6 text-blue-600" />
        <div className="text-left">
          <div className="font-medium">Lịch sử thanh toán</div>
          <div className="text-sm text-gray-600">Xem các giao dịch đã thực hiện</div>
        </div>
      </button>

      <button
        onClick={() => setShowStatusChecker(true)}
        className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all"
      >
        <Search className="w-6 h-6 text-green-600" />
        <div className="text-left">
          <div className="font-medium">Kiểm tra trạng thái</div>
          <div className="text-sm text-gray-600">Tra cứu bằng mã chuyển khoản</div>
        </div>
      </button>

      <button
        onClick={() => window.location.href = '/membership'}
        className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all"
      >
        <CreditCard className="w-6 h-6 text-purple-600" />
        <div className="text-left">
          <div className="font-medium">Mua gói mới</div>
          <div className="text-sm text-gray-600">Nâng cấp tài khoản</div>
        </div>
      </button>

      {showStatusChecker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full">
            <div className="mb-4 flex justify-end">
              <button
                onClick={() => setShowStatusChecker(false)}
                className="text-white hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <PaymentStatusChecker
              onPaymentFound={(payment) => {
                console.log('Payment found:', payment);
                setShowStatusChecker(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export { QuickPaymentActions };