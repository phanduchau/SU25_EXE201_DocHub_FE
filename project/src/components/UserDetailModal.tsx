import React from 'react';
import { motion } from 'framer-motion';
import {
  X, User, Mail, Phone, CalendarDays, MapPin, ShieldCheck, Edit2
} from 'lucide-react';
import { AdminUser } from '../types';

interface Props {
  user: AdminUser;
  onClose: () => void;
  onEdit?: () => void; // <- callback để mở modal sửa
}

const UserDetailModal: React.FC<Props> = ({ user, onClose, onEdit }) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-8 relative"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title + Edit */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-teal-700">Chi tiết người dùng</h2>
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition"
            >
              <Edit2 className="w-4 h-4" />
              Chỉnh sửa
            </button>
          )}
        </div>

        {/* Main */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar */}
          <div className="flex flex-col items-center md:w-1/3">
            <img
              src={user.imageUrl || 'https://via.placeholder.com/150'}
              alt="Avatar"
              className="w-40 h-40 rounded-full object-cover border-4 border-teal-500 shadow-lg"
            />
            <p className="mt-4 px-4 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold shadow">
              {user.roles.join(', ')}
            </p>
          </div>

          {/* Info Grid */}
          <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-teal-600" />
              <span><strong>Họ tên:</strong> {user.fullName}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-teal-600" />
              <span><strong>Username:</strong> {user.userName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-teal-600" />
              <span><strong>Email:</strong> {user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-teal-600" />
              <span><strong>SĐT:</strong> {user.phoneNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-600" />
              <span><strong>Địa chỉ:</strong> {user.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-teal-600" />
              <span>
                <strong>Ngày sinh:</strong> {new Date(user.dateOfBirth).toLocaleDateString()}
              </span>
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span><strong>Trạng thái:</strong></span>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {user.isActive ? 'Hoạt động' : 'Bị khóa'}
              </span>
            </div>
          </div>
        </div>

        {/* Certificate/QR (if any) */}
        {user.certificateImageUrl && (
          <div className="mt-6 text-center">
            <h4 className="text-sm text-gray-500 mb-2">Chứng chỉ / Thẻ hành nghề</h4>
            <img
              src={user.certificateImageUrl}
              alt="Certificate"
              className="mx-auto max-h-64 border rounded shadow"
            />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default UserDetailModal;
