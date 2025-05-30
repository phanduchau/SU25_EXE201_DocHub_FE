import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, Calendar } from 'lucide-react';
import Button from '../components/Button';

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'banking'>('card');
  const [cardInfo, setCardInfo] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/booking-confirmation');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 bg-teal-500 text-white">
            <h1 className="text-2xl font-bold">Thanh toán</h1>
            <p>Hoàn tất thanh toán để xác nhận lịch hẹn của bạn</p>
          </div>
          
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Chọn phương thức thanh toán</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  className={`p-4 border rounded-lg flex items-center justify-center ${
                    paymentMethod === 'card'
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200'
                  }`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  <span>Thẻ tín dụng/ghi nợ</span>
                </button>
                
                <button
                  className={`p-4 border rounded-lg flex items-center justify-center ${
                    paymentMethod === 'banking'
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200'
                  }`}
                  onClick={() => setPaymentMethod('banking')}
                >
                  <Lock className="h-5 w-5 mr-2" />
                  <span>Internet Banking</span>
                </button>
              </div>
            </div>
            
            {paymentMethod === 'card' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số thẻ
                  </label>
                  <input
                    type="text"
                    value={cardInfo.number}
                    onChange={(e) => setCardInfo({ ...cardInfo, number: e.target.value })}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên chủ thẻ
                  </label>
                  <input
                    type="text"
                    value={cardInfo.name}
                    onChange={(e) => setCardInfo({ ...cardInfo, name: e.target.value })}
                    placeholder="NGUYEN VAN A"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày hết hạn
                    </label>
                    <input
                      type="text"
                      value={cardInfo.expiry}
                      onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={cardInfo.cvv}
                      onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                      placeholder="123"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
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
                  
                  <Button type="submit" variant="primary" fullWidth size="lg">
                    Thanh toán ngay
                  </Button>
                </div>
              </form>
            )}
            
            {paymentMethod === 'banking' && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Hướng dẫn thanh toán</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600">
                    <li>Đăng nhập Internet Banking của ngân hàng của bạn</li>
                    <li>Chọn chức năng chuyển khoản</li>
                    <li>Nhập thông tin tài khoản nhận tiền</li>
                    <li>Nhập số tiền cần chuyển</li>
                    <li>Xác nhận và hoàn tất giao dịch</li>
                  </ol>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Thông tin chuyển khoản</h3>
                  <div className="space-y-2">
                    <p><span className="text-gray-600">Số tài khoản:</span> 123456789</p>
                    <p><span className="text-gray-600">Tên tài khoản:</span> CONG TY DOCHUB</p>
                    <p><span className="text-gray-600">Ngân hàng:</span> Vietcombank</p>
                    <p><span className="text-gray-600">Số tiền:</span> 350,000 VNĐ</p>
                    <p><span className="text-gray-600">Nội dung:</span> DOCHUB [Số điện thoại]</p>
                  </div>
                </div>
                
                <Button onClick={() => navigate('/booking-confirmation')} variant="primary" fullWidth size="lg">
                  Xác nhận đã thanh toán
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;