import React from 'react';
import { X, MessageCircle, Video, User, Mail, Stethoscope, AlertCircle  } from 'lucide-react';

interface Props {
  patientName: string;
  patientEmail: string;
  symptoms?: string;
  onClose: () => void;
  onChat: () => void;
  onVideoCall: () => void;
}

const PatientDetailsModal: React.FC<Props> = ({
  patientName,
  patientEmail,
  symptoms,
  onClose,
  onChat,
  onVideoCall
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white p-6 rounded-2xl w-[420px] shadow-2xl animate-fade-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex justify-center items-center gap-2">
            <Stethoscope className="w-6 h-6 text-teal-500" /> Thông tin bệnh nhân
          </h2>
          <p className="text-sm text-gray-500 mt-1">Chi tiết hồ sơ và hành động nhanh</p>
        </div>

        <div className="space-y-4 text-sm text-gray-800">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Họ và tên</p>
              <p className="font-medium text-base text-gray-800">{patientName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-medium text-base text-gray-800">{patientEmail}</p>
            </div>
          </div>
          {symptoms && (
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-gray-500 mt-1" />
              <div>
                <p className="text-xs text-gray-500">Triệu chứng</p>
                <p className="font-medium text-base text-gray-800 whitespace-pre-line">{symptoms}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={onChat}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 w-[48%]"
          >
            <MessageCircle className="w-4 h-4" /> Nhắn tin
          </button>
          <button
            onClick={onVideoCall}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-700 font-medium rounded-lg hover:bg-green-200 w-[48%]"
          >
            <Video className="w-4 h-4" /> Gọi video
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsModal;