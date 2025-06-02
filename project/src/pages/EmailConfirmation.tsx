import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import Button from '../components/Button';
import { confirmEmailApi } from '../apis/authApi';

const EmailConfirmation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');

  useEffect(() => {
    const email = searchParams.get('email')?.trim();
    const rawToken = searchParams.get('token')?.trim();

    if (!email || !rawToken) {
      setStatus('error');
      return;
    }

    const token = decodeURIComponent(rawToken.replace(/ /g, '+'));

    const confirm = async () => {
      try {
        const res = await confirmEmailApi({ email, token });
        console.log('✅ Confirm success:', res);
        if (res?.isSuccess) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (error: any) {
  const data = error?.response?.data;
  console.warn('❌ Confirm failed:', data);

  const isSuccess = data?.isSuccess;

  // Nếu là lỗi concurrency (đã xác nhận email trước đó) → vẫn cho thành công
  if (
    isSuccess ||
    data?.errorMessages?.some((msg: string) =>
      msg.includes('Optimistic concurrency failure')
    )
  ) {
    setStatus('success');
  } else {
    setStatus('error');
  }
}

    };

    setTimeout(confirm, 0);
  }, [searchParams]);

  if (status === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Đang xác nhận email...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {status === 'success' ? (
            <>
              <div className="p-6 bg-teal-500 text-white text-center">
                <CheckCircle className="h-16 w-16 mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-2">Xác nhận email thành công!</h1>
                <p>Tài khoản của bạn đã được kích hoạt.</p>
              </div>
              <div className="p-6 text-center space-y-4">
                <Button to="/login" variant="primary" fullWidth>
                  Đăng nhập ngay
                </Button>
                <Button to="/" variant="outline" fullWidth>
                  Về trang chủ
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="p-6 bg-red-500 text-white text-center">
                <XCircle className="h-16 w-16 mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-2">Xác nhận thất bại</h1>
                <p>Đường link không hợp lệ hoặc đã hết hạn.</p>
              </div>
              <div className="p-6 text-center space-y-4">
                <Button to="/login" variant="primary" fullWidth>
                  Đăng nhập ngay
                </Button>
                <Button to="/" variant="outline" fullWidth>
                  Về trang chủ
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmation;
