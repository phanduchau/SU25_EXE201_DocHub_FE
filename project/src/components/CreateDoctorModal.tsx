import React, { useState } from 'react';
import { createDoctorAccount, CreateDoctorPayload } from '../apis/admin/createAccountApi';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const CreateDoctorModal: React.FC<Props> = ({ onClose }) => {
  const [form, setForm] = useState<CreateDoctorPayload>({
    fullName: '',
    userName: '',
    email: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    certificateImageUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await createDoctorAccount(form);
      toast.success('Tạo tài khoản bác sĩ thành công!');
      onClose();
    } catch (err) {
      toast.error('Tạo tài khoản thất bại.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-8 relative animate-fade-in">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Tạo tài khoản bác sĩ</h2>

        {/* Form grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">Họ và tên</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">Tên đăng nhập</label>
            <input
              type="text"
              name="userName"
              value={form.userName}
              onChange={handleChange}
              placeholder="nguyenvana"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="email@example.com"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">Số điện thoại</label>
            <input
              type="tel"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="0123456789"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-700 font-medium mb-1">Địa chỉ</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Số 1 Nguyễn Trãi, Hà Nội"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">Ngày sinh</label>
            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">Chứng chỉ (URL)</label>
            <input
              type="text"
              name="certificateImageUrl"
              value={form.certificateImageUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Tạo tài khoản
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateDoctorModal;
