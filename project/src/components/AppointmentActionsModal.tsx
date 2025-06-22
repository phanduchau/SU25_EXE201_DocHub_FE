import React from 'react';
import { MessageCircle, Video, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  appointmentId: string;
  doctorName: string;
  onClose: () => void;
}

const AppointmentActionsModal: React.FC<Props> = ({ appointmentId, doctorName, onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="relative bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6 leading-snug">
          Hành động cho cuộc hẹn với<br />
          <span className="text-teal-600">{doctorName}</span>
        </h2>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => navigate(`/chat/${appointmentId}`)}
            className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
          >
            <MessageCircle className="w-6 h-6" />
            Chat với bác sĩ
          </button>

          <button
            onClick={() => navigate(`/video-call/${appointmentId}`)}
            className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl text-lg font-semibold bg-purple-600 text-white hover:bg-purple-700 transition duration-200"
          >
            <Video className="w-6 h-6" />
            Gọi video
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-800 underline transition"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentActionsModal;
