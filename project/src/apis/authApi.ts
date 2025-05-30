import axiosClient from './axiosClient';

export const loginApi = async (email: string, password: string) => {
  const response = await axiosClient.post('/Auth/login', {
    username: email,
    password: password,
  });
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await axiosClient.post('/Auth/forget-password', { email });
  return response.data; // Trả về dạng: { statusCode, isSuccess, result, ... }
};

export const resetPassword = async (email: string, token: string, newPassword: string) => {
  const response = await axiosClient.post('/Auth/reset-password', {
    email,
    token,
    newPassword,
  });
  return response.data;
}