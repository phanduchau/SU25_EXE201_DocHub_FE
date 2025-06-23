import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMessagesByAppointment } from '../apis/chat/chatApi';
import { createChatConnection } from '../apis/chat/chatHub';

interface Message {
  chatId: number;
  userId: string;
  message: string;
  timestamp: string;
}

const Chat: React.FC = () => {
  const { id } = useParams(); // lấy appointmentId từ URL
  const appointmentId = Number(id);
  const token = localStorage.getItem('token') || '';
  const userId = token ? JSON.parse(atob(token.split('.')[1])).sub : '';

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Kết nối SignalR
  useEffect(() => {
    const connect = async () => {
      try {
        const connection = createChatConnection(appointmentId);
        connectionRef.current = connection;

        connection.on('ReceiveMessage', (senderId: string, message: string) => {
          setMessages((prev) => [
            ...prev,
            {
              chatId: Date.now(),
              userId: senderId,
              message,
              timestamp: new Date().toISOString(),
            },
          ]);
        });

        await connection.start();
        console.log('✅ Connected to SignalR');
      } catch (error) {
        console.error('❌ Failed to connect to SignalR:', error);
      }
    };

    if (!isNaN(appointmentId)) {
      connect();
    }

    return () => {
      connectionRef.current?.stop();
    };
  }, [appointmentId]);

  // Lấy tin nhắn cũ từ API
  useEffect(() => {
    if (isNaN(appointmentId)) {
      setHasError(true);
      setLoading(false);
      return;
    }

    getMessagesByAppointment(appointmentId)
      .then((data) => {
        setMessages(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('❌ Lỗi khi lấy tin nhắn:', err);
        setHasError(true);
        setLoading(false);
      });
  }, [appointmentId]);

  // Cuộn xuống cuối khi có tin mới
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Gửi tin nhắn
  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      await connectionRef.current?.invoke('SendMessage', String(appointmentId), userId, input);
      setInput('');
    } catch (error) {
      console.error('❌ Gửi tin nhắn lỗi:', error);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Đang tải tin nhắn...</p>;
  }

  if (hasError || isNaN(appointmentId)) {
    return <p className="text-center mt-10 text-red-500">Không tìm thấy bác sĩ hoặc cuộc hẹn.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="h-[400px] overflow-y-auto bg-gray-100 rounded p-4">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">Chưa có tin nhắn nào</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 flex ${String(msg.userId) === String(userId) ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`px-4 py-2 rounded max-w-xs ${
                  String(msg.userId) === String(userId)
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border'
                }`}
              >
                <p>{msg.message}</p>
                <span className="text-[10px] text-gray-300 block text-right">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 mt-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 flex-1 rounded"
          placeholder="Nhập tin nhắn..."
        />
        <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2 rounded">
          Gửi
        </button>
      </div>
    </div>
  );
};

export default Chat;
