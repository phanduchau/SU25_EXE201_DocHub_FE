// Thông tin người dùng trong trang quản trị
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;     // ISO format e.g. "2024-01-15"
  lastLogin: string;    // ISO format e.g. "2024-03-10"
}

// Thông tin bác sĩ trong trang quản trị
export interface AdminDoctor {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  status: 'active' | 'pending' | 'suspended';
  patients: number;
  revenue: number;      // Số tiền kiếm được (VNĐ)
  rating: number;       // Trung bình đánh giá (0-5)
}

// Dữ liệu doanh thu theo tháng
export interface RevenueData {
  month: string;        // Ví dụ: 'Jan', 'Feb', ...
  revenue: number;      // Số tiền (VNĐ)
  appointments: number; // Số lượng lịch hẹn
  percentage: number;   // Phần trăm tăng trưởng (0–100)
}
