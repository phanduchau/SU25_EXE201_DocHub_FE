import React, { useState } from 'react';
import { AdminUser } from '../types';
import { updateUserById, activateUser, deactivateUser } from '../apis/admin/userAdminApi';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';

interface Props {
  user: AdminUser;
  onClose: () => void;
  onUpdateSuccess: () => void;
}

const EditUserModal: React.FC<Props> = ({ user, onClose, onUpdateSuccess }) => {
  const [form, setForm] = useState({
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    address: user.address,
    dateOfBirth: user.dateOfBirth,
    isActive: user.isActive,
    role: user.roles[0] || 'User',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, type, value, checked } = target;

    // Nếu là checkbox "isActive" → gọi API activate/deactivate
    if (name === 'isActive') {
      const newStatus = checked;
      setForm(prev => ({ ...prev, isActive: newStatus }));

      (async () => {
        try {
          if (newStatus) {
            await activateUser(user.id);
            toast.success('Đã kích hoạt tài khoản');
          } else {
            await deactivateUser(user.id);
            toast.success('Đã vô hiệu hóa tài khoản');
          }
        } catch {
          toast.error('Không thể cập nhật trạng thái hoạt động');
        }
      })();
      return;
    }

    // Các trường input còn lại
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        id: user.id,
        fullName: form.fullName,
        userName: user.userName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        address: form.address,
        dateOfBirth: form.dateOfBirth,
        isActive: form.isActive,
        imageUrl: user.imageUrl || '',
        role: form.role,
      };

      const result = await updateUserById(payload);
      if (result) {
        toast.success('Cập nhật người dùng thành công!');
        onUpdateSuccess();
        onClose();
      } else {
        toast.error('Cập nhật thất bại!');
      }
    } catch {
      toast.error('Lỗi khi cập nhật!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <h2 className="text-3xl font-bold text-teal-700 text-center mb-6">Chỉnh sửa thông tin người dùng</h2>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm text-gray-700">Họ tên</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="input"
              placeholder="Họ tên"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="input"
              placeholder="Email"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm text-gray-700">Số điện thoại</label>
            <input
              type="text"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              className="input"
              placeholder="SĐT"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm text-gray-700">Địa chỉ</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="input"
              placeholder="Địa chỉ"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm text-gray-700">Ngày sinh</label>
            <input
              type="date"
              name="dateOfBirth"
              value={new Date(form.dateOfBirth).toISOString().slice(0, 10)}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div className="flex items-center mt-7 gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              className="w-5 h-5 accent-teal-600"
            />
            <span className="text-sm text-gray-700">Trạng thái hoạt động</span>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>

      {/* Input style */}
      <style>{`
        .input {
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          outline: none;
          transition: box-shadow 0.2s ease;
        }
        .input:focus {
          box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.4);
          border-color: #0d9488;
        }
      `}</style>
    </div>
  );
};

export default EditUserModal;
