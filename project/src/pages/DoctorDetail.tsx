import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  MapPin,
  Medal,
  Phone,
  Video,
  MessageCircle,
} from 'lucide-react';
import Button from '../components/Button';
import {
  getDoctorProfile,
  getDoctorFeedback,
  addDoctorFeedback,
} from '../apis/doctors/doctorApi';
import { Feedback, CreateFeedbackDTO } from '../types';
import FeedbackModal, { FeedbackFormData } from '../components/FeedbackModal';

interface Doctor {
  doctorId: number;
  userName: string;
  userEmail: string;
  userPhone: string;
  imageDoctor: string | null;
  specialization: string;
  yearsOfExperience: number;
  bio: string;
  hospitalName: string;
  rating: number | null;
  isActive: boolean;
}

function formatDate(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const DoctorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [posting, setPosting] = useState(false);

  // Pagination state
  const pageSize = 3;
  const [visibleCount, setVisibleCount] = useState(pageSize);

  // Tính toán feedback đang hiển thị
  const visibleFeedbacks = useMemo(
    () => feedbacks.slice(0, visibleCount),
    [feedbacks, visibleCount]
  );

  const canShowMore = visibleCount < feedbacks.length;
  const canShowLess = visibleCount > pageSize;

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + pageSize);
  };

  const handleShowLess = () => {
    setVisibleCount(pageSize);
    window.scrollTo({
      top: (document.querySelector('#feedback-section') as HTMLElement | null)?.offsetTop || 0,
      behavior: 'smooth',
    });
  };

  const handleSubmitFeedback = async (data: FeedbackFormData) => {
    if (!id) return;

    setPosting(true);

    const payload: CreateFeedbackDTO = {
      doctorId: parseInt(id, 10),
      content: data.content,
      rating: data.rating,
    };

    try {
      const result = await addDoctorFeedback(payload);
      setFeedbacks((prev) => [result, ...prev]);
      setShowModal(false);
      // Hiển thị luôn feedback mới
      setVisibleCount((prev) => (prev < pageSize ? prev + 1 : prev));
    } catch (error) {
      console.error(error);
      alert('Gửi feedback thất bại!');
    } finally {
      setPosting(false);
    }
  };

  useEffect(() => {
    if (id) {
      getDoctorProfile(id)
        .then(setDoctor)
        .catch(() => setDoctor(null))
        .finally(() => setLoading(false));

      getDoctorFeedback(id)
        .then((data) => setFeedbacks(data))
        .catch(() => setFeedbacks([]))
        .finally(() => setLoadingFeedbacks(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-20">Đang tải dữ liệu bác sĩ...</div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h1 className="text-2xl font-bold">Không tìm thấy bác sĩ</h1>
          <p className="text-gray-500 my-4">
            Bác sĩ bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Button to="/doctors" variant="primary">
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row gap-6 items-center">
            <img
              src={
                doctor.imageDoctor ?? 'https://via.placeholder.com/150'
              }
              alt={doctor.userName}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-md border-4 border-white"
            />
            <div className="flex-1 space-y-2 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-800">
                {doctor.userName}
              </h2>
              <p className="text-teal-600 font-medium">
                {doctor.specialization}
              </p>
              <div className="flex items-center justify-center md:justify-start text-sm text-gray-500 gap-2">
                <Star className="text-yellow-400" size={16} />
                <span>{doctor.rating}</span>
                <span>|</span>
                <MapPin size={14} />
                <span>{doctor.hospitalName}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Phone size={14} /> Gọi điện
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Video size={14} /> Video
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <MessageCircle size={14} /> Chat
                </Button>
              </div>
            </div>
            <Link to={`/book-appointment/${doctor.doctorId}`}>
              <Button
                variant="primary"
                size="lg"
                className="w-full md:w-auto"
              >
                Đặt lịch ngay
              </Button>
            </Link>
          </div>

          {/* Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow p-6 space-y-4">
              <h3 className="text-xl font-semibold mb-2">
                Thông tin chi tiết
              </h3>
              <div className="flex items-center gap-3 text-gray-700">
                <Medal className="text-teal-500" size={20} />
                <span>
                  Kinh nghiệm:{' '}
                  <strong>{doctor.yearsOfExperience} năm</strong>
                </span>
              </div>
              <div>
                <h4 className="text-lg font-medium mt-4 mb-1">
                  Giới thiệu
                </h4>
                <p className="text-gray-600">{doctor.bio}</p>
              </div>
            </div>

            {/* Rating & Reviews */}
            <div className="bg-white rounded-xl shadow p-6 space-y-4">
              <h3 className="text-xl font-semibold mb-2">
                Đánh giá & nhận xét
              </h3>
              <div className="flex items-center gap-4">
                <div className="bg-teal-500 text-white rounded-lg px-4 py-2 text-3xl font-bold">
                  {doctor.rating}
                </div>
                <div>
                  <div className="flex items-center text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">
                    Dựa trên {feedbacks.length} đánh giá
                  </p>
                </div>
              </div>

              <div id="feedback-section" className="space-y-4">
                {loadingFeedbacks ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="animate-pulse bg-gray-200 h-4 w-full rounded"
                      ></div>
                    ))}
                  </div>
                ) : visibleFeedbacks.length > 0 ? (
                  visibleFeedbacks.map((review) => (
                    <div
                      key={review.feedbackId}
                      className="border-b pb-4"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center font-semibold text-gray-700">
                            {review.initials}
                          </div>
                          <div>
                            <p className="font-medium">{review.name}</p>
                            <div className="flex text-yellow-400">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4" />
                              ))}
                              {[...Array(5 - review.rating)].map(
                                (_, i) => (
                                  <Star
                                    key={i}
                                    className="w-4 h-4 text-gray-300"
                                  />
                                )
                              )}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(review.date)}
                        </span>
                      </div>
                      <p className="text-gray-700">
                        {review.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">
                    Chưa có đánh giá nào.
                  </p>
                )}
              </div>

              {/* Buttons for pagination */}
              <div className="flex gap-2 mt-4">
                {canShowMore && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleShowMore}
                  >
                    Xem thêm đánh giá
                  </Button>
                )}
                {canShowLess && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleShowLess}
                  >
                    Ẩn bớt
                  </Button>
                )}
              </div>

              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => setShowModal(true)}
              >
                Viết đánh giá
              </Button>
            </div>
          </div>
        </div>
      </div>

      <FeedbackModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitFeedback}
        loading={posting}
      />
    </>
  );
};

export default DoctorDetail;
