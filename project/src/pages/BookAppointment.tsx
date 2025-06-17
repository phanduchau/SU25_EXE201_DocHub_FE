import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, CreditCard, FileText } from 'lucide-react';
import Button from '../components/Button';
import AppointmentCalendar from '../components/AppointmentCalendar';
import { doctors } from '../data/doctors';
import { bookAppointmentApi } from '../apis/booking/appointmentApi';

const BookAppointment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState('');
  
  const doctor = doctors.find(d => d.id === id);
  
  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Không tìm thấy bác sĩ</h1>
          <p className="mb-4">Bác sĩ bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <Button to="/doctors" variant="primary">
            Quay lại danh sách bác sĩ
          </Button>
        </div>
      </div>
    );
  }

 const handleSubmit = async () => {
  if (!selectedDate || !selectedTime) {
    alert('Vui lòng chọn ngày và giờ khám');
    return;
  }

  try {
    const payload = {
      doctorId: doctor.id,
      date: selectedDate.toISOString(),
      time: selectedTime,
      symptoms,
    };

    const response = await bookAppointmentApi(payload);

    if (response?.isSuccess) {
      alert('Đặt lịch thành công!');
      // Redirect hoặc reset form tại đây nếu muốn
    } else {
      alert(response?.message || 'Đặt lịch thất bại');
    }
  } catch (error) {
    console.error('Lỗi đặt lịch:', error);
    alert('Có lỗi xảy ra khi đặt lịch');
  }
};


  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Đặt lịch khám</h1>
          <p className="text-gray-600">Đặt lịch khám với bác sĩ {doctor.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Thông tin bác sĩ</h2>
                <div className="flex items-center mb-6">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-20 h-20 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{doctor.name}</h3>
                    <p className="text-gray-600">{doctor.specialty}</p>
                    <p className="text-gray-600">{doctor.hospital}</p>
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

                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Phí tư vấn</span>
                      <span className="font-medium">{doctor.consultationFee?.toLocaleString()} VNĐ</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Phí đặt lịch</span>
                      <span className="font-medium">50,000 VNĐ</span>
                    </div>
                    <div className="flex justify-between font-medium text-lg border-t border-gray-200 pt-2 mt-2">
                      <span>Tổng cộng</span>
                      <span className="text-teal-600">
                        {(doctor.consultationFee! + 50000).toLocaleString()} VNĐ
                      </span>
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