import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, CreditCard, FileText } from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '../components/Button';
import AppointmentCalendar from '../components/AppointmentCalendar';
import { bookAppointmentApi } from '../apis/booking/appointmentApi';
import { getDoctorProfile } from '../apis/doctors/doctorApi';
import { useNavigate } from 'react-router-dom';

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

const BookAppointment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState('');
  const navigate = useNavigate();

  

  useEffect(() => {
    if (id) {
      getDoctorProfile(id)
        .then(setDoctor)
        .catch(() => {
          setDoctor(null);
          toast.error('Không tìm thấy bác sĩ');
        });
    }
  }, [id]);

 const handleSubmit = async () => {
  if (!selectedDate || !selectedTime) {
    toast.warning('Vui lòng chọn ngày và giờ khám');
    return;
  }

  try {
    // Ghép giờ vào ngày được chọn
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const localDateTime = new Date(selectedDate);
    localDateTime.setHours(hours, minutes, 0, 0);

    // Chuyển sang UTC
    const utcDateTime = new Date(localDateTime.getTime() - localDateTime.getTimezoneOffset() * 60000);
    const appointmentDateIso = utcDateTime.toISOString(); // ISO chuẩn, ví dụ: "2025-06-29T01:30:00.000Z"

    const payload = {
      doctorId: doctor!.doctorId,
      appointmentDate: appointmentDateIso,
      symptoms,
    };

    const response = await bookAppointmentApi(payload);

    if (response?.isSuccess && response.result?.appointmentId) {
      toast.success('🎉 Đặt lịch thành công!');
      setTimeout(() => {
        navigate(`/booking-confirmation/${response.result.appointmentId}`);
      }, 1000);
    } else {
      toast.error(response?.message || '❌ Đặt lịch thất bại');
    }
  } catch (error) {
    console.error('Lỗi đặt lịch:', error);
    toast.error('❌ Có lỗi xảy ra khi đặt lịch');
  }
};



  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Không tìm thấy bác sĩ</h1>
          <p className="mb-4">Bác sĩ bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <Button to="/doctors" variant="primary">Quay lại danh sách bác sĩ</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Đặt lịch khám</h1>
          <p className="text-gray-600">Đặt lịch khám với bác sĩ {doctor.userName}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Bên trái: thông tin bác sĩ + chọn thời gian */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Thông tin bác sĩ</h2>
                <div className="flex items-center mb-6">
                  <img
                    src={doctor.imageDoctor ?? '/default-avatar.png'}
                    alt={doctor.userName}
                    className="w-20 h-20 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{doctor.userName}</h3>
                    <p className="text-gray-600">{doctor.specialization}</p>
                    <p className="text-gray-600">{doctor.hospitalName}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-medium text-gray-900 mb-2">Mô tả triệu chứng</h3>
                  <textarea
                    rows={4}
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Mô tả chi tiết các triệu chứng của bạn..."
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Chọn thời gian</h2>
                <AppointmentCalendar
                  onSelectDate={setSelectedDate}
                  onSelectTime={setSelectedTime}
                />
              </div>
            </div>
          </div>

          {/* Bên phải: tổng quan & xác nhận */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Tổng quan cuộc hẹn</h2>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Ngày khám</p>
                      <p className="font-medium">
                        {selectedDate
                          ? selectedDate.toLocaleDateString('vi-VN', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          : 'Chưa chọn'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Giờ khám</p>
                      <p className="font-medium">{selectedTime || 'Chưa chọn'}</p>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    fullWidth
                    size="lg"
                    onClick={handleSubmit}
                    disabled={!selectedDate || !selectedTime}
                  >
                    Xác nhận đặt lịch
                  </Button>

                  <div className="text-sm text-gray-500 mt-4">
                    <p className="flex items-center mb-2">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Thanh toán an toàn và bảo mật
                    </p>
                    <p className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Nhận hóa đơn điện tử qua email
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
