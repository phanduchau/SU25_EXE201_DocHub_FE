import React, { useState } from 'react';
import { Star } from 'lucide-react';

export interface FeedbackFormData {
  content: string;
  rating: number;
}

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FeedbackFormData) => void;
  loading: boolean;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  open,
  onClose,
  onSubmit,
  loading,
}) => {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);

  const handleSubmit = () => {
    onSubmit({ content, rating });
    setContent('');
    setRating(5);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold mb-2">Viết đánh giá</h2>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Nội dung đánh giá..."
          className="w-full border border-gray-300 rounded p-2"
          rows={4}
        />
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={24}
              className={
                star <= rating
                  ? 'text-yellow-400 cursor-pointer'
                  : 'text-gray-300 cursor-pointer'
              }
              onClick={() => setRating(star)}
            />
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 border rounded text-gray-700"
            onClick={onClose}
            disabled={loading}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-teal-600 text-white rounded"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Đang gửi...' : 'Gửi'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
