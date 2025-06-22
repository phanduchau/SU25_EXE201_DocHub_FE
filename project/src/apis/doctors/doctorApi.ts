import axiosClient from '../axiosClient';
import { Doctor } from '../../types';

export const getAllDoctors = async () => {
  const res = await axiosClient.get('/Doctor');
  return res.data.result; // lấy phần "result" từ response
};

export const getDoctorsBySpecialization = async (specialization: string): Promise<Doctor[]> => {
  const response = await axiosClient.get(`/Doctor/specialization/${specialization}`);
  return response.data;
};

export const getActiveDoctors = async (): Promise<Doctor[]> => {
  const response = await axiosClient.get('/Doctor/active');
  return response.data;
};
export const getDoctorProfile = async (id: string) => {
  const response = await axiosClient.get(`/Doctor/${id}`);
  return response.data.result; // trả về phần "result"
};

export const updateDoctorProfile = async (id: string, data: any) => {
  const response = await axiosClient.put(`/Doctor/${id}`, data);
  return response.data;
};

