import axiosClient from '../axiosClient';
import { AdminUser } from '../../types';

export const getAllUsers = async () => {
  const res = await axiosClient.get('/Admin/getAllUsers');
  return res.data.result;
};

export const getUserById = async (id: string) => {
  const res = await axiosClient.get(`/Admin/getUserById/${id}`);
  return res.data.result;
};

export const updateUserById = async (data: any) => {
  const res = await axiosClient.put('/Admin/updateUser', data);
  return res.data.isSuccess;
};

export const deleteUser = async (id: string) => {
  const res = await axiosClient.delete(`/Admin/deleteUser/${id}`);
  return res.data.isSuccess;
};

export const activateUser = async (id: string) => {
  const res = await axiosClient.put(`/Admin/activate/${id}`);
  return res.data.isSuccess;
};

export const deactivateUser = async (id: string) => {
  const res = await axiosClient.put(`/Admin/deactivate/${id}`);
  return res.data.isSuccess;
};

export const getAllRoles = async () => {
  const res = await axiosClient.get('/Admin/getAllRoles');
  return res.data.result;
};

export const createRole = async (roleName: string) => {
  const res = await axiosClient.post('/Admin/createRole', { roleName });
  return res.data.isSuccess;
};
