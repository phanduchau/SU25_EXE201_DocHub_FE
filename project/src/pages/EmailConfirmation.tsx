import React from 'react';
import { CheckCircle } from 'lucide-react';
import Button from '../components/Button';

const EmailConfirmation: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 bg-teal-500 text-white text-center">
            <CheckCircle className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Xác nhận email thành công!</h1>
            <p>Tài khoản của bạn đã được kích hoạt</p>
          </div>
          
          <div className="p-6 text-center">
            <p className="text-gray-600 mb-6">
              Cảm ơn bạn đã xác nhận địa chỉ email. Bây giờ bạn có thể sử dụng đầy đủ các tính năng của DOCHUB.
            </p>
            
            <div className="space-y-4">
              <Button to="/login" variant="primary" fullWidth>
                Đăng nhập ngay
              </Button>
              
              <Button to="/" variant="outline" fullWidth>
                Về trang chủ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmation;