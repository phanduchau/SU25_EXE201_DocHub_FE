import axiosClient from '../axiosClient';
import { FeedbackDTO, FeedbackStatisticsDTO, UpdateFeedbackStatusDTO } from '../../types/index';

export const getAllFeedbacks = async (params?: any): Promise<FeedbackDTO[]> => {
  const { data } = await axiosClient.get('/Feedback', { params });
  return data.result;
};

export const getFeedbackByUserId = async (userId: string): Promise<FeedbackDTO[]> => {
  const { data } = await axiosClient.get(`/Feedback/user/${userId}`);
  return data.result;
};

export const updateFeedbackStatus = async (id: number, payload: UpdateFeedbackStatusDTO): Promise<any> => {
  const { data } = await axiosClient.put(`/Feedback/${id}/status`, payload);
  return data.result;
};

export const deleteFeedback = async (id: number): Promise<any> => {
  const { data } = await axiosClient.delete(`/Feedback/${id}`);
  return data.result;
};

export const getFeedbackStatistics = async (): Promise<FeedbackStatisticsDTO> => {
  const { data } = await axiosClient.get('/Feedback/statistics');
  return data.result;
};
