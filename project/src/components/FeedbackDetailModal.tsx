// src/components/FeedbackDetailModal.tsx
import React from "react";
import { FeedbackDTO } from "../types";

interface FeedbackDetailModalProps {
  feedback: FeedbackDTO;
  onClose: () => void;
  onToggleStatus: (id: number, newStatus: string) => void;
}

const FeedbackDetailModal: React.FC<FeedbackDetailModalProps> = ({
  feedback,
  onClose,
  onToggleStatus,
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">
            Chi tiết Feedback
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-gray-700 text-[15px]">
          <div>
            <span className="font-medium text-gray-500">Người dùng:</span>{" "}
            {feedback.name}
          </div>
          <div>
            <span className="font-medium text-gray-500">Doctor ID:</span>{" "}
            {feedback.doctorId}
          </div>
          <div>
            <span className="font-medium text-gray-500">Tên Bác sĩ:</span>{" "}
            {feedback.doctorName || "Không có"}
          </div>
          <div>
            <span className="font-medium text-gray-500">Nội dung:</span>{" "}
            {feedback.content}
          </div>
          <div>
            <span className="font-medium text-gray-500">Rating:</span>{" "}
            <span className="text-yellow-500 font-semibold">
              {feedback.rating}⭐
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-500">Ngày:</span>{" "}
            {feedback.date}
          </div>
          <div>
            <span className="font-medium text-gray-500">Trạng thái:</span>{" "}
            <span
              className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                feedback.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {feedback.status}
            </span>
          </div>
          {feedback.adminNotes && (
            <div>
              <span className="font-medium text-gray-500">Admin Notes:</span>{" "}
              {feedback.adminNotes}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={() =>
              onToggleStatus(
                feedback.feedbackId,
                feedback.status === "Active" ? "Hidden" : "Active"
              )
            }
            className={`px-4 py-2 rounded font-medium text-white transition
              ${
                feedback.status === "Active"
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-green-600 hover:bg-green-700"
              }`}
          >
            {feedback.status === "Active"
              ? "Ẩn Feedback"
              : "Hiện Feedback"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDetailModal;
