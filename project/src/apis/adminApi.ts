import axiosClient from './axiosClient';
import { AdminUser, AdminDoctor, RevenueData } from '../types/adminTypes';

// Gọi API tổng quan thống kê Dashboard
export const getAdminStats = async () => {
  const response = await axiosClient.get('/Admin/stats');
  return response.data; // Trả về: { totalUsers, totalOrders, totalSales, ... }
};

// Gọi API danh sách người dùng
export const getAdminUsers = async () => {
  const response = await axiosClient.get<AdminUser[]>('/Admin/users');
  return response.data;
};

// Gọi API danh sách bác sĩ
export const getAdminDoctors = async () => {
  const response = await axiosClient.get<AdminDoctor[]>('/Admin/doctors');
  return response.data;
};

// Gọi API dữ liệu doanh thu
export const getAdminRevenue = async () => {
  const response = await axiosClient.get<RevenueData[]>('/Admin/revenue');
  return response.data;
};

const adminApi = {
  getStats: getAdminStats,
  getUsers: getAdminUsers,
  getDoctors: getAdminDoctors,
  getRevenue: getAdminRevenue
};

export default adminApi;
