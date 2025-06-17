import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';
import Button from '../components/Button';
import { resetPassword } from '../apis/auth/authApi';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const rawToken = searchParams.get('token') || '';
  const token = decodeURIComponent(rawToken.replace(/ /g, '+'));

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu không khớp.');
      return;
    }

    try {
      const res = await resetPassword(email, token, newPassword);

      if (res.isSuccess) {
        toast.success('Đặt lại mật khẩu thành công!');
        setIsSuccess(true);
      } else {
        toast.error(res.result?.message || 'Đặt lại mật khẩu thất bại.');
      }
    } catch (error: any) {
      console.error('Lỗi đặt lại mật khẩu:', error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0] ||
        'Token không hợp lệ hoặc đã hết hạn.';

      toast.error(errorMessage);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold mb-4">Mật khẩu đã được đặt lại!</h2>
          <Button to="/login" variant="primary">Quay lại đăng nhập</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Đặt lại mật khẩu</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mật khẩu mới */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
            <input
              type={showNewPassword ? 'text' : 'password'}
              className="mt-1 w-full border border-gray-300 rounded-md p-2 pr-10"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <div
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-9 cursor-pointer text-gray-500"
            >
              {showNewPassword ? <EyeOff /> : <Eye />}
            </div>
          </div>

          {/* Xác nhận mật khẩu */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              className="mt-1 w-full border border-gray-300 rounded-md p-2 pr-10"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <div
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 cursor-pointer text-gray-500"
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </div>
          </div>

          <Button type="submit" variant="primary" fullWidth>Đặt lại mật khẩu</Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
