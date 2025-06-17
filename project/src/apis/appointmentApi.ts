import axiosClient from './axiosClient';

export const bookAppointmentApi = async (data: {
  doctorId: string;
  date: string; // ISO format
  time: string;
  symptoms: string;
}) => {
  const response = await axiosClient.post('/appointments', data);
  return response.data;
};
