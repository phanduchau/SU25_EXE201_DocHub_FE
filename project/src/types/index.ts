export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  rating: number;
  availability: {
    day: string;
    slots: { start: string; end: string }[];
  }[];
  hospital?: string;
  experience?: number;
  consultationFee?: number;
  education?: string[];
  languages?: string[];
  about?: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  type: 'in-person' | 'video' | 'chat';
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  recommended?: boolean;
}

export interface Specialty {
  id: string;
  name: string;
  icon: string;
}

export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}


// Thống kê tổng quan (Dashboard)
export interface StatsData {
  totalUsers: number;
  totalOrders: number;
  totalSales: number;
  totalPending: number;
  userGrowth: number;
  orderGrowth: number;
  salesGrowth: number;
  pendingGrowth: number;
}

// Người dùng

export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface AdminUser {
  id: string;
  userName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
  imageUrl: string;
  certificateImageUrl: string;
  isActive: boolean;
  roles: string[];
}

// Bác sĩ
export type DoctorStatus = 'active' | 'pending' | 'suspended';

export interface AdminDoctor {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  status: DoctorStatus;
  patients: number;
  revenue: number;
  rating: number;
}

// Dữ liệu doanh thu
export interface RevenueData {
  month: string;
  revenue: number;
  appointments: number;
  percentage: number;
}