import axiosClient from '../axiosClient';

export interface CreateDoctorPayload {
  fullName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string; // ISO 8601
  certificateImageUrl: string;
}

export const createDoctorAccount = async (data: CreateDoctorPayload) => {
  const response = await axiosClient.post('/Admin/create-account', data);
  return response.data;
};
