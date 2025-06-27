import axiosClient from '../axiosClient';
import { Doctor, CreateFeedbackDTO, Feedback } from '../../types';

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

export const updateDoctorProfile = async (doctorId: string, data: any) => {
  const payload = {
    specialization: data.specialization,
    yearsOfExperience: data.yearsOfExperience,
    bio: data.bio,
    hospitalName: data.hospitalName,
    imageDoctor: data.imageDoctor, // thêm dòng này
    isActive: true
  };

  const response = await axiosClient.put(`/Doctor/${doctorId}`, payload);
  return response.data;
};


export const getDoctorProfileByUserId = async (userId: string) => {
  const res = await axiosClient.get(`/Doctor/user/${userId}`);
  return res.data.result; 
};

export const getDoctorFeedback = async (doctorId: string): Promise<Feedback[]> => {
  const res = await axiosClient.get(`/Feedback/doctor/${doctorId}`);
  return res.data.result;
};

export const addDoctorFeedback = async (data: CreateFeedbackDTO): Promise<Feedback> => {
  const res = await axiosClient.post(`/Feedback`, data);
  return res.data.result;
};