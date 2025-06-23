import * as signalR from '@microsoft/signalr';
import { SignalData } from 'simple-peer';

let connection: signalR.HubConnection | null = null;

// Tạo kết nối SignalR với appointmentId (dùng cho cả chat/video)
export const createChatConnection = (appointmentId: number | string): signalR.HubConnection => {
  const token = localStorage.getItem('token') || '';

  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${import.meta.env.VITE_API_URL}/chatHub?appointmentId=${appointmentId}&access_token=${token}`)
    .withAutomaticReconnect()
    .build();

  return connection;
};

// Gửi tin nhắn (chat text)
export const sendMessage = (appointmentId: number | string, userId: string, message: string) => {
  return connection?.invoke('SendMessage', String(appointmentId), userId, message);
};

// Gửi tín hiệu video call
export const sendVideoSignal = (receiverId: string, signalData: SignalData) => {
  return connection?.invoke('SendVideoSignal', receiverId, signalData);
};

// Nhận tin nhắn
export const onReceiveMessage = (
  callback: (senderId: string, message: string) => void
) => {
  connection?.on('ReceiveMessage', callback);
};

// Nhận tín hiệu video call
export const onReceiveVideoSignal = (
  callback: (senderId: string, signalData: SignalData) => void
) => {
  connection?.on('ReceiveVideoSignal', (senderId: string, signal: SignalData) => {
    callback(senderId, signal);
  });
};
