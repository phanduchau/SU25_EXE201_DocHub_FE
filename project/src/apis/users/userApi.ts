import axiosClient from '../axiosClient';

// Lấy thông tin người dùng theo ID
export const getUserById = async (userId: string) => {
  try {
    const response = await axiosClient.get(`/User/${userId}`);
    console.log('API response:', response.data); // để debug
    return response.data;
  } catch (error) {
    console.error('Lỗi khi gọi API lấy user:', error);
    return null;
  }
};

// Cập nhật thông tin người dùng
export const updateUserById = async (userId: string, data: {
  fullName: string;
  address: string;
  dateOfBirth: string;
  imageUrl?: string;
}) => {
  try {
    const response = await axiosClient.put(`/User/${userId}`, data);
    console.log('Update user response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật user:', error);
    return null;
  }
};

// Tạo người dùng mới
export const createUser = async (data: {
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'patient';
  status: 'active' | 'inactive' | 'suspended';
}) => {
  try {
    const response = await axiosClient.post('/User', data);
    console.log('Tạo user thành công:', response.data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo user:', error);
    return null;
  }
};

// Xoá người dùng
export const deleteUser = async (userId: string) => {
  try {
    await axiosClient.delete(`/User/${userId}`);
    console.log(`Đã xoá user ${userId}`);
    return true;
  } catch (error) {
    console.error(`Lỗi khi xoá user ${userId}:`, error);
    return false;
  }
};

// Lấy danh sách tất cả người dùng
export const getAllUsers = async () => {
  const res = await axiosClient.get('/User');
  return res.data;
};