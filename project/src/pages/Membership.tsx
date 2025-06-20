import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  CreditCard,
  Loader2,
  ChevronDown
} from 'lucide-react';

// Types based on existing data structure
interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  recommended?: boolean;
}

interface CreatePaymentRequest {
  planId: number; // Change from string to number
  billingCycle: 'Monthly' | 'Yearly';
  paymentMethod: 'VNPay' | 'MoMo' | 'Banking'; // Update to match backend validation
}

const MembershipPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [billingCycle, setBillingCycle] = useState<'Monthly' | 'Yearly'>('Monthly');
  const [paymentMethod, setPaymentMethod] = useState<'VNPay' | 'MoMo' | 'Banking'>('VNPay');
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);

  // Use existing membership data structure
  useEffect(() => {
    const membershipPlans: MembershipPlan[] = [
      {
        id: '1',
        name: 'Gói cơ bản',
        price: 50,
        features: [
          'Nhận tư vấn từ một bác sĩ mỗi tháng',
          'Truy cập thông tin y tế cơ bản',
          'Thông báo nhắc nhở lịch khám định kỳ',
          'Lưu trữ hồ sơ y tế cá nhân'
        ]
      },
      {
        id: '2',
        name: 'Gói tiêu chuẩn',
        price: 100,
        features: [
          'Tất cả tính năng của gói Cơ bản',
          'Tư vấn không giới hạn với 3 bác sĩ',
          'Ưu tiên đặt lịch khám',
          'Thông báo nhắc nhở dùng thuốc',
          'Hỗ trợ tư vấn qua video call',
          'Giảm 5% phí khám'
        ],
        recommended: true
      },
      {
        id: '3',
        name: 'Gói thành viên',
        price: 250,
        features: [
          'Tất cả tính năng của gói Tiêu chuẩn',
          'Tư vấn không giới hạn với tất cả bác sĩ',
          'Ưu tiên cao nhất khi đặt lịch khám',
          'Thông báo nhắc nhở tự động',
          'Hỗ trợ tư vấn 24/7',
          'Giảm 10% phí khám',
          'Báo cáo sức khỏe định kỳ'
        ]
      }
    ];
    setPlans(membershipPlans);
    setSelectedPlan(membershipPlans[1].id); // Default to recommended plan
  }, []);

  const handleCreatePayment = async () => {
    if (!selectedPlan) {
      alert('Vui lòng chọn gói membership');
      return;
    }

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vui lòng đăng nhập để tiếp tục');
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    try {
      const paymentRequest: CreatePaymentRequest = {
        planId: parseInt(selectedPlan), // Convert to int to match BE
        billingCycle,
        paymentMethod
      };

      console.log('Making payment request:', paymentRequest);
      console.log('API URL:', 'https://localhost:7057/api/subscription/payment/create-payment-url');

      const response = await fetch('https://localhost:7057/api/subscription/payment/create-payment-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentRequest)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        // Log response details for debugging
        const responseText = await response.text();
        console.error('Error response:', responseText);
        
        if (response.status === 401) {
          alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        } else if (response.status === 404) {
          alert('API endpoint không tìm thấy. Vui lòng kiểm tra server đã chạy chưa');
          return;
        } else if (response.status === 500) {
          alert('Lỗi server nội bộ. Vui lòng liên hệ admin');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (data.isSuccess && data.result?.paymentUrl) {
        // Store transaction info for tracking
        localStorage.setItem('pendingPayment', JSON.stringify({
          transactionRef: data.result.transactionRef,
          planName: data.result.planName,
          amount: data.result.amount,
          billingCycle: data.result.billingCycle,
          timestamp: new Date().toISOString()
        }));

        // Redirect to payment gateway
        window.location.href = data.result.paymentUrl;
      } else {
        const errorMessage = data.errorMessages?.[0] || 'Có lỗi xảy ra khi tạo thanh toán';
        alert(errorMessage);
        
        // Handle specific error cases
        if (errorMessage.includes('đã có gói thành viên')) {
          setTimeout(() => {
            window.location.href = '/subscription/status';
          }, 2000);
        }
      }
    } catch (error: unknown) {
      console.error('Payment creation error:', error);
      
      // Type guard để check error type
      if (error instanceof Error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          alert('Không thể kết nối đến server. Vui lòng kiểm tra:\n1. Server đã chạy chưa?\n2. URL có đúng không?\n3. CORS có được cấu hình không?');
        } else {
          alert(`Có lỗi xảy ra: ${error.message}`);
        }
      } else {
        alert('Có lỗi xảy ra. Vui lòng thử lại sau');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-teal-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Gói thành viên</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cung cấp dịch vụ tốt nhất cho người dùng
          </p>
        </div>
        
        {/* Membership Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg cursor-pointer ${
                plan.recommended 
                  ? 'border-2 border-teal-500 transform scale-105' 
                  : 'border border-gray-200'
              } ${
                selectedPlan === plan.id 
                  ? 'ring-2 ring-teal-600 ring-offset-2' 
                  : ''
              }`}
            >
              {plan.recommended && (
                <div className="bg-teal-500 text-white text-center py-1 font-medium text-sm">
                  Gói được đề xuất
                </div>
              )}
              
              <div className="p-6 bg-teal-50">
                <h3 className="text-xl font-bold text-center mb-2">{plan.name}</h3>
                <div className="text-center">
                  <span className="text-3xl font-bold text-teal-700">{plan.price.toLocaleString()}k</span>
                  <span className="text-teal-600">/tháng</span>
                </div>
              </div>
              
              <div className="p-6 bg-white">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <CheckCircle className="h-5 w-5 text-teal-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-6">
                  <button 
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                      selectedPlan === plan.id
                        ? 'bg-teal-600 text-white'
                        : plan.recommended 
                        ? 'bg-teal-600 text-white hover:bg-teal-700' 
                        : 'border-2 border-teal-600 text-teal-600 hover:bg-teal-50'
                    }`}
                  >
                    {selectedPlan === plan.id ? 'Đã chọn' : 'Thanh toán'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Options */}
        {selectedPlan && (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Thông tin thanh toán</h2>
            
            {/* Selected Plan Summary */}
            <div className="bg-teal-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-medium">Gói đã chọn:</span>
                <span className="font-bold text-teal-700">
                  {plans.find(p => p.id === selectedPlan)?.name}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="font-medium">Giá:</span>
                <span className="font-bold text-teal-700">
                  {plans.find(p => p.id === selectedPlan)?.price.toLocaleString()}k VND/tháng
                </span>
              </div>
            </div>

            {/* Billing Cycle */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chu kỳ thanh toán
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setBillingCycle('Monthly')}
                  className={`p-3 border-2 rounded-lg transition-all ${
                    billingCycle === 'Monthly'
                      ? 'border-teal-600 bg-teal-50 text-teal-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  Hàng tháng
                </button>
                <button
                  onClick={() => setBillingCycle('Yearly')}
                  className={`p-3 border-2 rounded-lg transition-all relative ${
                    billingCycle === 'Yearly'
                      ? 'border-teal-600 bg-teal-50 text-teal-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  Hàng năm
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Tiết kiệm 10%
                  </span>
                </button>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phương thức thanh toán
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod('VNPay')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    paymentMethod === 'VNPay'
                      ? 'border-teal-600 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center mb-2">
                    <CreditCard className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="font-medium">VNPay</div>
                  <div className="text-sm text-gray-600">Thẻ ATM, Visa, MasterCard</div>
                </button>

                <button
                  onClick={() => setPaymentMethod('MoMo')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    paymentMethod === 'MoMo'
                      ? 'border-pink-600 bg-pink-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                      M
                    </div>
                  </div>
                  <div className="font-medium">MoMo</div>
                  <div className="text-sm text-gray-600">Ví điện tử MoMo</div>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleCreatePayment}
              disabled={loading}
              className="w-full bg-teal-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                'Thanh toán ngay'
              )}
            </button>
          </div>
        )}
        
        {/* Comparison Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">So sánh các gói thành viên</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4">Tính năng</th>
                    <th className="text-center py-4 px-4">Gói cơ bản</th>
                    <th className="text-center py-4 px-4 bg-teal-50">Gói tiêu chuẩn</th>
                    <th className="text-center py-4 px-4">Gói thành viên</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-4">Tư vấn với bác sĩ</td>
                    <td className="text-center py-4 px-4">1 bác sĩ/tháng</td>
                    <td className="text-center py-4 px-4 bg-teal-50">3 bác sĩ không giới hạn</td>
                    <td className="text-center py-4 px-4">Tất cả bác sĩ không giới hạn</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-4">Ưu tiên đặt lịch</td>
                    <td className="text-center py-4 px-4">❌</td>
                    <td className="text-center py-4 px-4 bg-teal-50">✅</td>
                    <td className="text-center py-4 px-4">✅ Cao nhất</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-4">Video call tư vấn</td>
                    <td className="text-center py-4 px-4">❌</td>
                    <td className="text-center py-4 px-4 bg-teal-50">✅</td>
                    <td className="text-center py-4 px-4">✅</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-4">Hỗ trợ 24/7</td>
                    <td className="text-center py-4 px-4">❌</td>
                    <td className="text-center py-4 px-4 bg-teal-50">❌</td>
                    <td className="text-center py-4 px-4">✅</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-4">Giảm phí khám</td>
                    <td className="text-center py-4 px-4">❌</td>
                    <td className="text-center py-4 px-4 bg-teal-50">5%</td>
                    <td className="text-center py-4 px-4">10%</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-4">Báo cáo sức khỏe định kỳ</td>
                    <td className="text-center py-4 px-4">❌</td>
                    <td className="text-center py-4 px-4 bg-teal-50">❌</td>
                    <td className="text-center py-4 px-4">✅</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Câu hỏi thường gặp</h2>
            
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold mb-2">Làm thế nào để đăng ký gói thành viên?</h3>
                <p className="text-gray-700">
                  Bạn có thể đăng ký gói thành viên bằng cách chọn gói phù hợp và nhấn vào nút "Thanh toán", sau đó làm theo hướng dẫn để hoàn tất quá trình thanh toán.
                </p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold mb-2">Tôi có thể hủy gói thành viên bất cứ lúc nào không?</h3>
                <p className="text-gray-700">
                  Có, bạn có thể hủy gói thành viên của mình bất cứ lúc nào. Việc hủy sẽ có hiệu lực vào cuối kỳ thanh toán hiện tại của bạn.
                </p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold mb-2">Tôi có thể nâng cấp hoặc hạ cấp gói thành viên không?</h3>
                <p className="text-gray-700">
                  Có, bạn có thể thay đổi gói thành viên của mình bất cứ lúc nào. Nếu bạn nâng cấp, sự thay đổi sẽ có hiệu lực ngay lập tức, và bạn sẽ được tính phí cho phần chênh lệch. Nếu bạn hạ cấp, thay đổi sẽ có hiệu lực vào kỳ thanh toán tiếp theo.
                </p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold mb-2">Làm thế nào để sử dụng ưu đãi giảm phí khám?</h3>
                <p className="text-gray-700">
                  Ưu đãi giảm phí khám sẽ được áp dụng tự động khi bạn đặt lịch khám với bác sĩ trên hệ thống DOCHUB. Giảm phí sẽ được hiển thị trong tổng thanh toán khi xác nhận đặt lịch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipPage;