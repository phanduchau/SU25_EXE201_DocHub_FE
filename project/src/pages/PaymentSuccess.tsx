// src/pages/PaymentSuccess.tsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Home, FileText } from 'lucide-react';
import Button from '../components/Button';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { transactionId, planName, amount } = location.state || {};

  useEffect(() => {
    // Auto redirect after 10 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Thanh toán thành công!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Cảm ơn bạn đã nâng cấp tài khoản. Gói thành viên của bạn đã được kích hoạt thành công.
        </p>

        {planName && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800">
              <strong>Gói đã kích hoạt:</strong> {planName}
            </p>
            {amount && (
              <p className="text-green-700 text-sm mt-1">
                Số tiền: {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(amount)}
              </p>
            )}
          </div>
        )}

        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Về trang chủ
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate('/payment/history')}
            className="w-full flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Xem lịch sử thanh toán
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Tự động chuyển về trang chủ sau 10 giây...
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;