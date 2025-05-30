import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, MapPin } from 'lucide-react';
import Button from '../components/Button';

const BookingConfirmation: React.FC = () => {
  const navigate = useNavigate();
  
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
                    <p className="font-medium">Thứ 2, 15/03/2024</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-teal-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Thời gian</p>
                    <p className="font-medium">09:00 - 09:30</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-teal-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Địa điểm</p>
                    <p className="font-medium">Phòng khám DOCHUB - 123 Đường ABC, Quận XYZ</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Thông tin thanh toán</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Phí khám</span>
                  <span>300,000 VNĐ</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Phí đặt lịch</span>
                  <span>50,000 VNĐ</span>
                </div>
                <div className="flex justify-between font-medium text-lg pt-2 border-t border-gray-200 mt-2">
                  <span>Tổng cộng</span>
                  <span className="text-teal-600">350,000 VNĐ</span>
                </div>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <Button variant="primary" onClick={() => navigate('/appointments')}>
                Xem lịch hẹn của tôi
              </Button>
              <p className="text-sm text-gray-600">
                Chúng tôi đã gửi email xác nhận đến địa chỉ email của bạn.
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