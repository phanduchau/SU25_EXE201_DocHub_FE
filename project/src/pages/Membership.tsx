import React from 'react';
import MembershipCard from '../components/MembershipCard';
import { membershipPlans } from '../data/memberships';

const Membership: React.FC = () => {
  return (
    <div className="min-h-screen bg-teal-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Gói thành viên</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cung cấp dịch vụ tốt nhất cho người dùng
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {membershipPlans.map((plan) => (
            <MembershipCard key={plan.id} plan={plan} />
          ))}
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                    <td className="text-center py-4 px-4">1 bác sĩ / tháng</td>
                    <td className="text-center py-4 px-4 bg-teal-50">3 bác sĩ không giới hạn</td>
                    <td className="text-center py-4 px-4">Tất cả bác sĩ không giới hạn</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-4">Ưu tiên đặt lịch</td>
                    <td className="text-center py-4 px-4">❌</td>
                    <td className="text-center py-4 px-4 bg-teal-50">✅</td>
                    <td className="text-center py-4 px-4">✅ (Ưu tiên cao nhất)</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-4">Nhắc lịch dùng thuốc</td>
                    <td className="text-center py-4 px-4">❌</td>
                    <td className="text-center py-4 px-4 bg-teal-50">✅</td>
                    <td className="text-center py-4 px-4">✅</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-4">Hỗ trợ tư vấn 24/7</td>
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
        
        <div className="mt-16">
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
    </div>
  );
};

export default Membership;