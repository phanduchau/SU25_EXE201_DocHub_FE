import axiosClient from './axiosClient';

// Create doctor account
export const createDoctorAccount = async (doctorData: {
  fullName: string;
  email: string;
  phoneNumber: string;
  specialty: string;
  hospital: string;
  experience: number;
  education: string[];
  languages: string[];
  about: string;
  consultationFee: number;
}) => {
  const response = await axiosClient.post('/Admin/create-doctor', doctorData);
  return response.data;
};

// Get doctor profile
export const getDoctorProfile = async (doctorId: string) => {
  const response = await axiosClient.get(`/Doctor/profile/${doctorId}`);
  return response.data;
};

// Update doctor profile
export const updateDoctorProfile = async (doctorId: string, data: any) => {
  const response = await axiosClient.put(`/Doctor/profile/${doctorId}`, data);
  return response.data;
};

// Get doctor appointments
export const getDoctorAppointments = async (doctorId: string) => {
  const response = await axiosClient.get(`/Doctor/appointments/${doctorId}`);
  return response.data;
};

// Update appointment status
export const updateAppointmentStatus = async (appointmentId: string, status: string) => {
  const response = await axiosClient.put(`/Doctor/appointments/${appointmentId}/status`, { status });
  return response.data;
};

// Get doctor schedule
export const getDoctorSchedule = async (doctorId: string) => {
  const response = await axiosClient.get(`/Doctor/schedule/${doctorId}`);
  return response.data;
};

// Update doctor schedule
export const updateDoctorSchedule = async (doctorId: string, schedule: any) => {
  const response = await axiosClient.put(`/Doctor/schedule/${doctorId}`, schedule);
  return response.data;
};

// Get doctor statistics
export const getDoctorStats = async (doctorId: string) => {
  const response = await axiosClient.get(`/Doctor/stats/${doctorId}`);
  return response.data;
};

const doctorApi = {
  createDoctorAccount,
  getDoctorProfile,
  updateDoctorProfile,
  getDoctorAppointments,
  updateAppointmentStatus,
  getDoctorSchedule,
  updateDoctorSchedule,
  getDoctorStats
};

export default doctorApi;