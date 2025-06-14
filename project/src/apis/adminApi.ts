import axios from './axiosClient'; //

// API lấy danh sách người dùng
export const getAllUsers = async () => {
  const response = await axios.get('/users');
  return response.data;
};

// API lấy danh sách bác sĩ
export const getAllDoctors = async () => {
  const response = await axios.get('/doctors');
  return response.data;
};

// API lấy thống kê doanh thu
export const getRevenueStats = async () => {
  const response = await axios.get('/revenue');
  return response.data;
};
