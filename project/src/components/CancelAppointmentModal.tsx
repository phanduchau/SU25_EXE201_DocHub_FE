import React, { useState } from "react";
import { XCircle, X } from "lucide-react";
import Button from "./Button";

interface CancelAppointmentModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  cancelBy?: "doctor" | "patient";
}

const CancelAppointmentModal: React.FC<CancelAppointmentModalProps> = ({
  open,
  onClose,
  onConfirm,
  cancelBy,
}) => {
  const [reason, setReason] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-6">
        {/* Close Button */}
        <button
          onClick={() => {
            setReason("");
            onClose();
          }}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-red-100 p-2 rounded-full">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            Hủy cuộc hẹn
          </h3>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          {cancelBy === "patient"
            ? "Vui lòng nhập lý do hủy cuộc hẹn để chúng tôi thông báo cho bác sĩ."
            : "Vui lòng nhập lý do hủy cuộc hẹn để chúng tôi thông báo cho bệnh nhân."}
        </p>

        <textarea
          rows={4}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors"
          placeholder="Nhập lý do hủy..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        ></textarea>

        <div className="mt-6 flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => {
              setReason("");
              onClose();
            }}
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (!reason.trim()) return;
              onConfirm(reason.trim());
              setReason("");
            }}
          >
            Xác nhận
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CancelAppointmentModal;
