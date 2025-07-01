// src/pages/Payment.tsx - Complete fixed version
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Copy,
  RefreshCw,
  ArrowLeft,
  QrCode,
  Timer,
  Loader2,
  Download
} from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import Button from '../components/Button';
import { 
  createVietQRPayment,
  getVietQRPaymentStatus,
  CreateVietQRPaymentRequest,
  VietQRPaymentResponse,
  PaymentRequestStatus,
  VietQRUtils
} from '../apis/vietqr/vietqrApi';

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const statusCheckRef = useRef<NodeJS.Timeout | null>(null);
  const createRequestRef = useRef<boolean>(false);
  const mountedRef = useRef<boolean>(true);
  
  // State từ Membership page
  const { plan, billingCycle, price } = location.state || {};
  
  const [paymentData, setPaymentData] = useState<VietQRPaymentResponse | null>(null);
  const [status, setStatus] = useState<'creating' | 'pending' | 'checking' | 'confirmed' | 'expired' | 'error'>('creating');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<string>('');
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    // Validation
    if (!plan || !billingCycle || !price) {
      console.error('❌ Missing payment data:', { plan, billingCycle, price });
      toast.error('Thông tin thanh toán không hợp lệ');
      navigate('/membership');
      return;
    }

    if (!user) {
      console.error('❌ User not logged in');
      toast.error('Vui lòng đăng nhập để tiếp tục');
      navigate('/login');
      return;
    }

    // ✅ KHÔNG set mountedRef.current = false trong cleanup
    // Component chỉ thực sự unmount khi user leave page

    // Tạo payment request
    if (!createRequestRef.current && !paymentData) {
      createRequestRef.current = true;
      createPaymentRequest();
    }

    // ✅ Chỉ cleanup intervals, KHÔNG set mountedRef = false
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (statusCheckRef.current) {
        clearInterval(statusCheckRef.current);
        statusCheckRef.current = null;
      }
      // KHÔNG làm: mountedRef.current = false;
    };
  }, []); // Empty dependency array để tránh re-run

  useEffect(() => {
    if (paymentData && status === 'pending') {
      console.log('✅ Starting countdown and status check for payment:', paymentData.paymentRequestId);
      startCountdown();
      startStatusCheck();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (statusCheckRef.current) {
        clearInterval(statusCheckRef.current);
        statusCheckRef.current = null;
      }
    };
  }, [paymentData, status]);

  const createPaymentRequest = async () => {
    if (isCreating) {
      console.warn('⚠️ Already creating, skipping...');
      return;
    }

    try {
      console.log('🚀 Creating payment request...');
      setIsCreating(true);
      setStatus('creating');
      setError('');

      const request: CreateVietQRPaymentRequest = {
        planId: parseInt(plan.id),
        billingCycle: billingCycle as 'Monthly' | 'Yearly'
      };

      console.log('📝 Request payload:', request);

      // ✅ Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout after 30 seconds')), 30000)
      );

      const apiPromise = createVietQRPayment(request);
      const data = await Promise.race([apiPromise, timeoutPromise]) as VietQRPaymentResponse;
      
      console.log('✅ API Response received:', data);

      // ✅ Validate response data
      if (!data) {
        throw new Error('Không nhận được dữ liệu từ server');
      }

      if (!data.paymentRequestId) {
        throw new Error('Response thiếu paymentRequestId');
      }

      if (!data.qrCodeUrl) {
        throw new Error('Response thiếu qrCodeUrl');
      }

      if (!data.transferCode) {
        throw new Error('Response thiếu transferCode');
      }

      console.log('✅ Setting payment data and changing status to pending');
      
      // ✅ LUÔN update state, bỏ check mountedRef
      setPaymentData(data);
      setTimeLeft(data.expiresInMinutes * 60);
      setStatus('pending'); // Set ngay lập tức
      toast.success('Đã tạo mã QR thanh toán thành công');
      console.log('✅ Status changed to pending, payment data set');

    } catch (error: any) {
      console.error('❌ Error creating payment request:', error);
      
      const errorMessage = error.message || 'Có lỗi xảy ra khi tạo yêu cầu thanh toán';
      setError(errorMessage);
      setStatus('error');
      toast.error(errorMessage);
    } finally {
      setIsCreating(false);
      console.log('✅ isCreating set to false');
    }
  };

  const startCountdown = () => {
    if (!paymentData) {
      console.warn('⚠️ Cannot start countdown: missing paymentData');
      return;
    }

    console.log('⏰ Starting countdown timer');

    const updateCountdown = () => {
      if (!paymentData) return;
      
      const timeRemaining = VietQRUtils.calculateTimeRemaining(paymentData.expiresAt);
      setTimeLeft(timeRemaining.totalSeconds);

      if (timeRemaining.isExpired) {
        console.log('⏰ Payment expired');
        setStatus('expired');
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        if (statusCheckRef.current) {
          clearInterval(statusCheckRef.current);
          statusCheckRef.current = null;
        }
        toast.warning('Mã QR đã hết hạn. Vui lòng tạo mã QR mới.');
      }
    };

    updateCountdown();
    intervalRef.current = setInterval(updateCountdown, 1000);
  };

  const startStatusCheck = () => {
    if (!paymentData) {
      console.warn('⚠️ Cannot start status check: missing paymentData');
      return;
    }

    console.log('🔄 Starting status check timer');

    const checkStatus = async () => {
      if (!paymentData) return;
      
      try {
        console.log('🔍 Checking payment status...');
        const statusData = await getVietQRPaymentStatus(paymentData.paymentRequestId);
        console.log('📊 Status check result:', statusData);
        
        if (statusData.status === 'Confirmed') {
          console.log('✅ Payment confirmed!');
          setStatus('confirmed');
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          if (statusCheckRef.current) {
            clearInterval(statusCheckRef.current);
            statusCheckRef.current = null;
          }
          toast.success('Thanh toán đã được xác nhận!');
        } else if (statusData.status === 'Expired') {
          console.log('⏰ Payment expired via status check');
          setStatus('expired');
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          if (statusCheckRef.current) {
            clearInterval(statusCheckRef.current);
            statusCheckRef.current = null;
          }
        }
      } catch (error) {
        console.error('❌ Error checking payment status:', error);
      }
    };

    statusCheckRef.current = setInterval(checkStatus, 10000);
  };

  // ✅ Add manual status check for debugging
  const forceStatusCheck = () => {
    console.log('🔧 Force checking status and data...');
    console.log('Current state:', {
      status,
      paymentData: !!paymentData,
      isCreating,
      createRequestRef: createRequestRef.current,
      mountedRef: mountedRef.current
    });
    
    if (paymentData) {
      console.log('Payment data:', paymentData);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatPrice = (price: number): string => {
    return VietQRUtils.formatVietnamCurrency(price);
  };

  const copyToClipboard = async (text: string, type: string) => {
    const success = await VietQRUtils.copyToClipboardWithFallback(text);
    if (success) {
      setCopied(type);
      setTimeout(() => setCopied(''), 2000);
      toast.success('Đã sao chép vào clipboard');
    } else {
      toast.error('Không thể sao chép. Vui lòng copy thủ công.');
    }
  };

  const handleCreateNewQR = () => {
    console.log('🔄 Creating new QR code...');
    
    // Reset all states and flags
    setPaymentData(null);
    setTimeLeft(0);
    setStatus('creating');
    setError('');
    createRequestRef.current = false;
    
    // Clear intervals
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (statusCheckRef.current) {
      clearInterval(statusCheckRef.current);
      statusCheckRef.current = null;
    }
    
    // Create new request
    setTimeout(() => {
      if (mountedRef.current) {
        createRequestRef.current = true;
        createPaymentRequest();
      }
    }, 100);
  };

  const handlePaymentCompleted = () => {
    toast.success('Cảm ơn bạn đã thông báo! Chúng tôi sẽ kiểm tra và xác nhận thanh toán trong thời gian sớm nhất.');
    
    setTimeout(() => {
      if (mountedRef.current) {
        navigate('/');
      }
    }, 3000);
  };

  const checkPaymentStatus = async () => {
    if (!paymentData || !mountedRef.current) return;

    try {
      setStatus('checking');
      const statusData = await getVietQRPaymentStatus(paymentData.paymentRequestId);
      
      if (!mountedRef.current) return;
      
      if (statusData.status === 'Confirmed') {
        setStatus('confirmed');
        toast.success('Thanh toán đã được xác nhận!');
      } else {
        setStatus('pending');
        toast.info('Thanh toán chưa được xác nhận. Vui lòng đợi hoặc liên hệ hỗ trợ.');
      }
    } catch (error: any) {
      console.error('Error checking payment status:', error);
      if (mountedRef.current) {
        setStatus('pending');
        toast.error('Có lỗi khi kiểm tra trạng thái thanh toán');
      }
    }
  };

  const downloadQRCode = () => {
    if (paymentData?.qrCodeUrl) {
      const link = document.createElement('a');
      link.href = paymentData.qrCodeUrl;
      link.download = `QR_${paymentData.transferCode}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Đã tải xuống mã QR');
    }
  };

  // ✅ Chỉ cleanup khi component thực sự unmount
  useEffect(() => {
    return () => {
      console.log('🧹 Component cleanup - clearing intervals');
      mountedRef.current = false; // Chỉ set false khi thực sự unmount
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (statusCheckRef.current) {
        clearInterval(statusCheckRef.current);
      }
    };
  }, []);

  // ✅ Enhanced loading state with debug info
  if (status === 'creating') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-teal-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Đang tạo mã QR thanh toán...</h3>
          <p className="text-gray-600 mb-4">Vui lòng đợi trong giây lát</p>
          
          {/* ✅ Debug info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-gray-400 space-y-1 border-t pt-4">
              <p>Debug Info:</p>
              <p>Creating: {isCreating.toString()}</p>
              <p>CreateRef: {createRequestRef.current.toString()}</p>
              <p>PaymentData: {(!!paymentData).toString()}</p>
              <p>Status: {status}</p>
              <button
                onClick={forceStatusCheck}
                className="bg-gray-200 px-2 py-1 rounded text-xs mt-2"
              >
                Check Status
              </button>
            </div>
          )}
          
          {/* ✅ Timeout fallback */}
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-2">Quá lâu không phản hồi?</p>
            <Button
              variant="outline"
              onClick={handleCreateNewQR}
              className="text-sm"
            >
              Thử tạo lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-600 mb-2">Có lỗi xảy ra</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-3">
            <Button
              onClick={handleCreateNewQR}
              disabled={isCreating}
              className="flex-1"
            >
              {isCreating ? 'Đang tạo...' : 'Thử lại'}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/membership')}
              disabled={isCreating}
              className="flex-1"
            >
              Quay lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (status === 'confirmed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Thanh toán thành công!
          </h2>
          <p className="text-gray-600 mb-6">
            Tài khoản của bạn đã được nâng cấp thành công lên gói {paymentData?.planName}.
          </p>
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-green-700">
              <strong>Mã giao dịch:</strong> {paymentData?.transferCode}
            </p>
          </div>
          <Button onClick={() => navigate('/')} className="w-full">
            Về trang chủ
          </Button>
        </div>
      </div>
    );
  }

  // Expired state
  if (status === 'expired') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          <Clock className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-orange-600 mb-2">Hết thời gian thanh toán</h3>
          <p className="text-gray-600 mb-4">
            Mã QR đã hết hạn sau 15 phút. Vui lòng tạo mã QR mới để tiếp tục thanh toán.
          </p>
          <div className="flex gap-3">
            <Button
              onClick={handleCreateNewQR}
              className="flex-1 flex items-center justify-center gap-2"
              disabled={isCreating}
            >
              <RefreshCw className={`w-4 h-4 ${isCreating ? 'animate-spin' : ''}`} />
              Tạo mã QR mới
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/membership')}
              className="flex-1"
            >
              Quay lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    console.warn('⚠️ No payment data but status is not creating/error');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Không thể tải thông tin thanh toán</p>
          <Button onClick={handleCreateNewQR} className="mt-4">
            Tạo lại yêu cầu thanh toán
          </Button>
        </div>
      </div>
    );
  }

  // Main payment interface - will be rendered when status is 'pending'
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/membership')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            Thanh toán gói thành viên
          </h1>
        </div>

        {/* Debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 font-medium mb-2">Debug Info:</p>
            <div className="text-xs text-yellow-700 space-y-1">
              <p>Status: {status}</p>
              <p>Payment ID: {paymentData?.paymentRequestId}</p>
              <p>Transfer Code: {paymentData?.transferCode}</p>
              <p>QR URL: {paymentData?.qrCodeUrl ? 'Available' : 'Missing'}</p>
              <p>Time Left: {timeLeft}s</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Code Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <QrCode className="w-4 h-4" />
                Quét mã QR để thanh toán
              </div>
              
              {/* Countdown Timer */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <Timer className="w-5 h-5 text-orange-500" />
                <span className="text-lg font-mono font-bold text-orange-500">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-gray-500">còn lại</span>
              </div>
            </div>

            {/* QR Code Display */}
            <div className="flex justify-center mb-6">
              <div className="relative inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
                <img
                  src={paymentData.qrCodeUrl}
                  alt="QR Code"
                  className="w-64 h-64 object-contain"
                  onError={(e) => {
                    console.error('QR Code image failed to load');
                    e.currentTarget.style.display = 'none';
                  }}
                />
                
                <button
                  onClick={downloadQRCode}
                  className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-all"
                  title="Tải xuống QR code"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="text-center mb-6">
              {status === 'checking' ? (
                <div className="flex items-center justify-center gap-2 text-blue-600">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Đang kiểm tra trạng thái...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-orange-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Đang chờ thanh toán...</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={checkPaymentStatus}
                className="w-full flex items-center justify-center gap-2"
                disabled={status === 'checking'}
              >
                <RefreshCw className={`w-4 h-4 ${status === 'checking' ? 'animate-spin' : ''}`} />
                Kiểm tra trạng thái
              </Button>
              
              <Button
                onClick={handlePaymentCompleted}
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Đã chuyển khoản xong
              </Button>
            </div>
          </div>

          {/* Payment Information */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Thông tin đơn hàng
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Gói thành viên:</span>
                  <span className="font-medium">{paymentData.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chu kỳ thanh toán:</span>
                  <span className="font-medium">
                    {paymentData.billingCycle === 'Yearly' ? 'Hàng năm' : 'Hàng tháng'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã giao dịch:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{paymentData.transferCode}</span>
                    <button
                      onClick={() => copyToClipboard(paymentData.transferCode, 'code')}
                      className="text-teal-600 hover:text-teal-700"
                    >
                      {copied === 'code' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng tiền:</span>
                    <span className="text-teal-600">{formatPrice(paymentData.amount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Thông tin chuyển khoản
                </h3>
                <button
                  onClick={() => setShowBankDetails(!showBankDetails)}
                  className="text-teal-600 text-sm hover:text-teal-700"
                >
                  {showBankDetails ? 'Ẩn' : 'Hiện'} chi tiết
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngân hàng:</span>
                  <span className="font-medium">{paymentData.bankAccount.bankName}</span>
                </div>
                
                {showBankDetails && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số tài khoản:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{paymentData.bankAccount.accountNo}</span>
                        <button
                          onClick={() => copyToClipboard(paymentData.bankAccount.accountNo, 'account')}
                          className="text-teal-600 hover:text-teal-700"
                        >
                          {copied === 'account' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Chủ tài khoản:</span>
                      <span className="font-medium">{paymentData.bankAccount.accountName}</span>
                    </div>
                  </>
                )}
                
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="text-gray-600 font-medium">Nội dung CK:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-red-600">{paymentData.transferCode}</span>
                    <button
                      onClick={() => copyToClipboard(paymentData.transferCode, 'content')}
                      className="text-teal-600 hover:text-teal-700"
                    >
                      {copied === 'content' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                Hướng dẫn thanh toán
              </h3>
              <ol className="text-blue-800 text-sm space-y-2">
                <li>1. Mở ứng dụng ngân hàng của bạn</li>
                <li>2. Quét mã QR hoặc nhập thông tin chuyển khoản</li>
                <li>3. <strong>Nhập đúng nội dung chuyển khoản:</strong> {paymentData.transferCode}</li>
                <li>4. Xác nhận và thực hiện chuyển khoản</li>
                <li>5. Nhấn "Đã chuyển khoản xong" sau khi hoàn thành</li>
              </ol>
              
              <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  <strong>Lưu ý quan trọng:</strong> Vui lòng nhập đúng nội dung chuyển khoản 
                  <span className="font-mono font-bold"> {paymentData.transferCode} </span>
                  để chúng tôi có thể xác nhận thanh toán nhanh chóng.
                </p>
              </div>
            </div>

            {/* Process Flow */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Quy trình xử lý
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">1</div>
                  <span>Bạn thực hiện chuyển khoản qua QR code</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">2</div>
                  <span>Nhấn "Đã chuyển khoản xong" để thông báo</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs">3</div>
                  <span>Admin kiểm tra và xác nhận thanh toán</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs">4</div>
                  <span>Tài khoản được nâng cấp tự động</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;