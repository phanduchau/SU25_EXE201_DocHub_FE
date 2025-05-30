import axiosClient from './axiosClient';

export const loginApi = async (email: string, password: string) => {
  const response = await axiosClient.post('/Auth/login', {
    username: email,
    password: password,
  });
  return response.data;
};

