import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, MapPin, Calendar, Clock, Medal, BookOpen, Languages, Phone, Video, MessageCircle } from 'lucide-react';
import Button from '../components/Button';
import AppointmentCalendar from '../components/AppointmentCalendar';
import { doctors } from '../data/doctors';
import { Doctor } from '../types';

const DoctorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
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
  
  const handleAppointmentSubmit = () => {
    if (selectedDate && selectedTime) {
      alert(`Đặt lịch khám với ${doctor.name} vào ngày ${selectedDate.toLocaleDateString()} lúc ${selectedTime} thành công!`);
    } else {
      alert('Vui lòng chọn ngày và giờ khám!');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-teal-500 h-32 md:h-48 relative"></div>
          
          <div className="p-6 relative">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/4 -mt-16 md:-mt-24 mb-6 md:mb-0 flex justify-center md:justify-start">
                <img 
                  src={doctor.image} 
                  alt={doctor.name} 
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-md"
                />
              </div>
              
              <div className="md:w-3/4 md:pl-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{doctor.name}</h1>
                    <p className="text-gray-600 mb-2">{doctor.specialty}</p>
                    
                    <div className="flex items-center mb-2">
                      <Star className="h-5 w-5 text-yellow-400 mr-1" />
                      <span className="font-medium">{doctor.rating}</span>
                      <span className="mx-2 text-gray-300">|</span>
                      <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-gray-600">{doctor.hospital}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Phone size={16} className="mr-1" /> Gọi điện
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Video size={16} className="mr-1" /> Video
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center">
                      <MessageCircle size={16} className="mr-1" /> Chat
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center">
                    <Medal className="h-5 w-5 text-teal-500 mr-2" />
                    <div>
                      <span className="text-sm text-gray-600">Kinh nghiệm</span>
                      <p className="font-medium">{doctor.experience} năm</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-teal-500 mr-2" />
                    <div>
                      <span className="text-sm text-gray-600">Phí tư vấn</span>
                      <p className="font-medium">{doctor.consultationFee?.toLocaleString()} VNĐ</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Languages className="h-5 w-5 text-teal-500 mr-2" />
                    <div>
                      <span className="text-sm text-gray-600">Ngôn ngữ</span>
                      <p className="font-medium">{doctor.languages?.join(', ')}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Giới thiệu</h3>
                  <p className="text-gray-700 mb-4">{doctor.about}</p>
                  
                  <h3 className="text-lg font-semibold mb-2">Học vấn</h3>
                  <ul className="list-disc list-inside mb-4 text-gray-700">
                    {doctor.education?.map((edu, index) => (
                      <li key={index}>{edu}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Lịch khám</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {doctor.availability.map((slot, index) => (
                    <div key={index} className="border border-gray-200 rounded-md p-4">
                      <h3 className="font-medium mb-2">{slot.day}</h3>
                      <div className="space-y-2">
                        {slot.slots.map((time, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="text-sm">
                              <Clock size={14} className="inline mr-1" /> 
                              {time.start} - {time.end}
                            </span>
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                              Còn chỗ
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Đánh giá và nhận xét</h2>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="bg-teal-500 text-white rounded-lg p-4 mr-4">
                      <span className="text-3xl font-bold">{doctor.rating}</span>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400" />
                        <Star className="h-5 w-5 text-yellow-400" />
                        <Star className="h-5 w-5 text-yellow-400" />
                        <Star className="h-5 w-5 text-yellow-400" />
                        <Star className="h-5 w-5 text-yellow-400" />
                      </div>
                      <p className="text-sm text-gray-600">Dựa trên 152 đánh giá</p>
                    </div>
                  </div>
                  <Button variant="outline">Viết đánh giá</Button>
                </div>
                
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="bg-gray-200 h-10 w-10 rounded-full mr-3 flex items-center justify-center">
                          <span className="font-medium text-gray-700">TV</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Trần Văn A</h4>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <Star className="h-4 w-4 text-yellow-400" />
                            <Star className="h-4 w-4 text-yellow-400" />
                            <Star className="h-4 w-4 text-yellow-400" />
                            <Star className="h-4 w-4 text-yellow-400" />
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">2 tuần trước</span>
                    </div>
                    <p className="text-gray-700">
                      Bác sĩ rất tận tâm và chuyên nghiệp. Tôi đã khám và được điều trị hiệu quả. Chắc chắn sẽ quay lại nếu cần.
                    </p>
                  </div>
                  
                  <div className="border-b border-gray-200 pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="bg-gray-200 h-10 w-10 rounded-full mr-3 flex items-center justify-center">
                          <span className="font-medium text-gray-700">NH</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Nguyễn Hoàng B</h4>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <Star className="h-4 w-4 text-yellow-400" />
                            <Star className="h-4 w-4 text-yellow-400" />
                            <Star className="h-4 w-4 text-yellow-400" />
                            <Star className="h-4 w-4 text-gray-300" />
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">1 tháng trước</span>
                    </div>
                    <p className="text-gray-700">
                      Bác sĩ rất am hiểu chuyên môn, giải thích bệnh rất rõ ràng và dễ hiểu. Thời gian chờ đợi hơi lâu nhưng đáng giá với chất lượng khám bệnh.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <AppointmentCalendar 
              onSelectDate={setSelectedDate}
              onSelectTime={setSelectedTime}
            />
            
            {selectedDate && selectedTime && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6 p-6">
                <h3 className="text-lg font-semibold mb-4">Xác nhận lịch hẹn</h3>
                
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <div className="flex items-center mb-3">
                    <Calendar className="h-5 w-5 text-teal-500 mr-2" />
                    <div>
                      <span className="text-sm text-gray-600">Ngày khám</span>
                      <p className="font-medium">{selectedDate.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-teal-500 mr-2" />
                    <div>
                      <span className="text-sm text-gray-600">Giờ khám</span>
                      <p className="font-medium">{selectedTime}</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span>Phí tư vấn</span>
                    <span>{doctor.consultationFee?.toLocaleString()} VNĐ</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Thuế (VAT 10%)</span>
                    <span>{Math.round(doctor.consultationFee! * 0.1).toLocaleString()} VNĐ</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Tổng cộng</span>
                    <span>{Math.round(doctor.consultationFee! * 1.1).toLocaleString()} VNĐ</span>
                  </div>
                </div>
                
                <Button variant="primary" fullWidth onClick={handleAppointmentSubmit}>
                  Xác nhận đặt lịch
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;