import axiosClient from '../axiosClient';

export const getMessagesByAppointment = async (appointmentId: number) => {
  const res = await axiosClient.get(`/chat/appointment/${appointmentId}`);
  return res.data.result;
};

export const sendMessageToApi = async (data: {
  appointmentId: number;
  message: string;
}) => {
  const res = await axiosClient.post(`/chat`, data);
  return res.data.result;
};
