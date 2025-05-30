import axiosClient from './axiosClient';

// Lấy thông tin người dùng theo ID
export const getUserById = async (userId: string) => {
  try {
    const response = await axiosClient.get(`/User/${userId}`);
    console.log('✅ API response:', response.data); // để debug
    return response.data;
  } catch (error) {
    console.error('❌ Lỗi khi gọi API lấy user:', error);
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
    console.log('✅ Update user response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Lỗi khi cập nhật user:', error);
    return null;
  }
};
