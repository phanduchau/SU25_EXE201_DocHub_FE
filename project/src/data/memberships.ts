import { MembershipPlan } from '../types';

export const membershipPlans: MembershipPlan[] = [
  {
    id: '1',
    name: 'Gói cơ bản',
    price: 50000,
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
    price: 100000,
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
    price: 250000,
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