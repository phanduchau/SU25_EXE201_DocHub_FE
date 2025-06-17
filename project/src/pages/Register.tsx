import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Home, Calendar, Eye, EyeOff } from 'lucide-react';
import Button from '../components/Button';
import { registerApi } from '../apis/auth/authApi';
import { toast } from 'react-toastify';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    userName: '',
    email: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: '',
    terms: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Mật khẩu và xác nhận không khớp!');
      return;
    }

    if (new Date(formData.dateOfBirth) > new Date()) {
      toast.error('Ngày sinh không hợp lệ!');
      return;
    }

    try {
      const payload = {
        fullName: formData.fullName,
        userName: formData.userName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
        password: formData.password,
      };

      const result = await registerApi(payload);

      if (result?.isSuccess) {
        toast.success(result.message || 'Đăng ký thành công!, Hãy Confirm email để kích hoạt tài khoản!');
        navigate('/login');
      } else {
        toast.error(result.message || 'Đăng ký thất bại!');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Đăng ký thất bại';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Đăng ký tài khoản</h2>
            <p className="mt-2 text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <Link to="/login" className="font-medium text-teal-600 hover:text-teal-500">
                Đăng nhập
              </Link>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <InputField id="fullName" label="Họ và tên" icon={<User />} type="text" value={formData.fullName} onChange={(val) => setFormData({ ...formData, fullName: val })} />
            <InputField id="userName" label="Tên đăng nhập" icon={<User />} type="text" value={formData.userName} onChange={(val) => setFormData({ ...formData, userName: val })} />
            <InputField id="email" label="Email" icon={<Mail />} type="email" value={formData.email} onChange={(val) => setFormData({ ...formData, email: val })} />
            <InputField id="phoneNumber" label="Số điện thoại" icon={<Phone />} type="tel" value={formData.phoneNumber} onChange={(val) => setFormData({ ...formData, phoneNumber: val })} />
            <InputField id="address" label="Địa chỉ" icon={<Home />} type="text" value={formData.address} onChange={(val) => setFormData({ ...formData, address: val })} />
            <InputField id="dateOfBirth" label="Ngày sinh" icon={<Calendar />} type="date" value={formData.dateOfBirth} onChange={(val) => setFormData({ ...formData, dateOfBirth: val })} />
            <PasswordField id="password" label="Mật khẩu" value={formData.password} show={showPassword} toggle={() => setShowPassword(!showPassword)} onChange={(val) => setFormData({ ...formData, password: val })} />
            <PasswordField id="confirmPassword" label="Xác nhận mật khẩu" value={formData.confirmPassword} show={showPassword} toggle={() => setShowPassword(!showPassword)} onChange={(val) => setFormData({ ...formData, confirmPassword: val })} />

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                checked={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                Tôi đồng ý với{' '}
                <Link to="/terms" className="font-medium text-teal-600 hover:text-teal-500">
                  điều khoản
                </Link>{' '}
                và{' '}
                <Link to="/privacy" className="font-medium text-teal-600 hover:text-teal-500">
                  chính sách bảo mật
                </Link>
              </label>
            </div>

            <div>
              <Button type="submit" variant="primary" fullWidth size="lg">
                Đăng ký
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

// ---------- Component phụ ----------
interface InputFieldProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  type: string;
  value: string;
  onChange: (value: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({ id, label, icon, type, value, onChange }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="mt-1 relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        {icon}
      </div>
      <input
        id={id}
        name={id}
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
      />
    </div>
  </div>
);

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  show: boolean;
  toggle: () => void;
  onChange: (value: string) => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({ id, label, value, show, toggle, onChange }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="mt-1 relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        <Lock />
      </div>
      <input
        id={id}
        name={id}
        type={show ? 'text' : 'password'}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
        <button type="button" onClick={toggle} className="text-gray-400 hover:text-gray-500 focus:outline-none">
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </div>
  </div>
);
