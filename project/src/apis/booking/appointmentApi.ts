// src/apis/booking/appointmentApi.ts
import axiosClient from '../axiosClient';

export const bookAppointmentApi = async (data: {
  doctorId: number;
  appointmentDate: string; // ISO format
  symptoms: string;
}) => {
  const response = await axiosClient.post('/Appointment', data);
  return response.data;
};

export const getAppointmentById = async (id: number) => {
  const response = await axiosClient.get(`/Appointment/${id}`);
  return response.data;
};