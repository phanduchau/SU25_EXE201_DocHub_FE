import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Medal, Languages, Phone, Video, MessageCircle } from 'lucide-react';
import Button from '../components/Button';
import { doctors } from '../data/doctors';
import { getDoctorProfile } from '../apis/doctors/doctorApi';

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

const DoctorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getDoctorProfile(id)
        .then(setDoctor)
        .catch(() => setDoctor(null))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return <div className="text-center py-20">Đang tải dữ liệu bác sĩ...</div>;
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h1 className="text-2xl font-bold">Không tìm thấy bác sĩ</h1>
          <p className="text-gray-500 my-4">Bác sĩ bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <Button to="/doctors" variant="primary">Quay lại danh sách</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row gap-6 items-center">
          <img
            src={doctor.imageDoctor ?? 'https://via.placeholder.com/150'}
            alt={doctor.userName}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-md border-4 border-white"
          />
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800">{doctor.userName}</h2>
            <p className="text-teal-600 font-medium">{doctor.specialization}</p>
            <div className="flex items-center justify-center md:justify-start text-sm text-gray-500 gap-2">
              <Star className="text-yellow-400" size={16} />
              <span>{doctor.rating}</span>
              <span>|</span>
              <MapPin size={14} />
              <span>{doctor.hospitalName}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
              <Button variant="outline" size="sm" className="flex items-center gap-1"><Phone size={14} /> Gọi điện</Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1"><Video size={14} /> Video</Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1"><MessageCircle size={14} /> Chat</Button>
            </div>
          </div>
          <Link to={`/book-appointment/${doctor.doctorId}`}>
            <Button variant="primary" size="lg" className="w-full md:w-auto">Đặt lịch ngay</Button>
          </Link>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <h3 className="text-xl font-semibold mb-2">Thông tin chi tiết</h3>
            <div className="flex items-center gap-3 text-gray-700">
              <Medal className="text-teal-500" size={20} />
              <span>Kinh nghiệm: <strong>{doctor.yearsOfExperience} năm</strong></span>
            </div>
            <div>
              <h4 className="text-lg font-medium mt-4 mb-1">Giới thiệu</h4>
              <p className="text-gray-600">{doctor.bio}</p>
            </div>
          </div>

          {/* Rating & Reviews */}
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <h3 className="text-xl font-semibold mb-2">Đánh giá & nhận xét</h3>
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
                <p className="text-sm text-gray-500">Dựa trên 152 đánh giá</p>
              </div>
            </div>

            {/* Example reviews (static) */}
            <div className="space-y-4">
              {[
                { name: 'Trần Văn A', initials: 'TV', date: '2 tuần trước', content: 'Bác sĩ rất tận tâm và chuyên nghiệp.' },
                { name: 'Nguyễn Hoàng B', initials: 'NH', date: '1 tháng trước', content: 'Giải thích bệnh rất rõ ràng và dễ hiểu.' }
              ].map((review, index) => (
                <div key={index} className="border-b pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center font-semibold text-gray-700">{review.initials}</div>
                      <div>
                        <p className="font-medium">{review.name}</p>
                        <div className="flex text-yellow-400">
                          {[...Array(4)].map((_, i) => <Star key={i} className="w-4 h-4" />)}
                          <Star className="w-4 h-4 text-gray-300" />
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-700">{review.content}</p>
                </div>
              ))}
            </div>

            <Button variant="outline" className="mt-4 w-full">Viết đánh giá</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;
