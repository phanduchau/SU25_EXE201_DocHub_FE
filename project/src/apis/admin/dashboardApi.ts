import axiosClient from '../axiosClient';
import { ApiResponse, DashboardStatisticsDto } from '../../types/index';

export const getDashboardStatistics = async (period: "week" | "month" | "year") => {
  const res = await axiosClient.get<ApiResponse<DashboardStatisticsDto>>(
    `/Admin/dashboard-statistics?period=${period}`
  );
  return res.data;
};
