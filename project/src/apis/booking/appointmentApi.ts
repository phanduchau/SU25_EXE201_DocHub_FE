// src/apis/booking/appointmentApi.ts
import axiosClient from '../axiosClient';
import { Appointment } from '../../types/index';

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

export const getAppointmentsByUserId = async (userId: string) => {
  const res = await axiosClient.get(`/Appointment/user/${userId}`);
  return res.data.result;
};

export const getAppointmentsByDoctorId = async (doctorId: string): Promise<Appointment[]> => {
  const res = await axiosClient.get(`/Appointment/doctor/${doctorId}`);
  return res.data.result; // Lấy phần `result` chứa danh sách lịch hẹn
};

export const confirmAppointment = async (appointmentId: string) => {
  await axiosClient.post(`/Appointment/${appointmentId}/confirm`);
};

export const cancelAppointment = async (appointmentId: string) => {
  await axiosClient.post(`/Appointment/${appointmentId}/cancel`);
};