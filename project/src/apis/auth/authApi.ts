import axiosClient from '../axiosClient';

export const loginApi = async (email: string, password: string, remember: boolean) => {
  const response = await axiosClient.post('/Auth/login', {
    username: email,
    password: password,
  });

  const data = response.data;
  //console.log('Login response:', data);

  const token = data.result?.token;
  const refeshToken = data.result?.refeshToken;

  if (!token || !refeshToken) {
    throw new Error('Token hoặc refreshToken không hợp lệ');
  }

  if (remember) {
    localStorage.setItem('token', token);
    localStorage.setItem('refeshToken', refeshToken);
    localStorage.setItem('remember', 'true');
  } else {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('refeshToken', refeshToken);
    localStorage.setItem('remember', 'false');
  }

  return data;
};

// ✅ Gọi /refresh-token để lấy token mới
export const refreshTokenApi = async () => {
  const refreshToken = sessionStorage.getItem('refeshToken') || localStorage.getItem('refeshToken');
  const response = await axiosClient.post(`/Auth/refresh-token`, {
    refreshToken,
  });
  return response.data; // trả về: { token, refreshToken }  
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
};

export const registerApi = async (data: {
  fullName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string; // ISO string format, e.g. '2025-05-30T08:41:41.278Z'
  password: string;
}) => {
  const response = await axiosClient.post('/Auth/register', data);
  return response.data;
};

export const confirmEmailApi = async (data: { email: string; token: string }) => {
  const response = await axiosClient.post('/Auth/confirm-email', data);
  return response.data; // Trả về object có `isSuccess`, `message`, `statusCode`
};

