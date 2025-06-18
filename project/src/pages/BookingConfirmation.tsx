import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, MapPin } from 'lucide-react';
import Button from '../components/Button';
import { getAppointmentById } from '../apis/booking/appointmentApi';
import { toast } from 'react-toastify';

interface Appointment {
  appointmentId: number;
  userName: string;
  doctorName: string;
  appointmentDate: string;
  symptoms: string;
  status: string;
}

const BookingConfirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    if (id) {
      getAppointmentById(Number(id))
        .then((res) => {
          if (res?.isSuccess) {
            setAppointment(res.result);
          } else {
            toast.error('Không tìm thấy lịch hẹn');
            navigate('/');
          }
        })
        .catch(() => {
          toast.error('Lỗi khi tải lịch hẹn');
          navigate('/');
        });
    }
  }, [id, navigate]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });

  if (!appointment) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 bg-teal-500 text-white text-center">
            <CheckCircle className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Đặt lịch thành công!</h1>
            <p>Cảm ơn bạn đã đặt lịch khám tại DOCHUB</p>
          </div>

          <div className="p-6">
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Chi tiết lịch hẹn</h2>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-teal-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Ngày khám</p>
                    <p className="font-medium">{formatDate(appointment.appointmentDate)}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-teal-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Thời gian</p>
                    <p className="font-medium">{formatTime(appointment.appointmentDate)}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-teal-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Bác sĩ</p>
                    <p className="font-medium">{appointment.doctorName}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Triệu chứng</p>
                  <p className="font-medium">{appointment.symptoms}</p>
                </div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <Button variant="primary" onClick={() => navigate('/appointments')}>
                Xem lịch hẹn của tôi
              </Button>
              <p className="text-sm text-gray-600">
                Chúng tôi đã gửi email xác nhận đến địa chỉ của bạn.
                <br />
                Vui lòng kiểm tra hộp thư đến.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
