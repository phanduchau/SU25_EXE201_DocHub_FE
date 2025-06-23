import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Mic, MicOff, Video, VideoOff, Phone, MessageSquare } from 'lucide-react';
import SimplePeer, { SignalData } from 'simple-peer';
import {
  createChatConnection,
  sendVideoSignal,
  onReceiveVideoSignal,
} from '../apis/chat/chatHub';

const VideoCall: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // appointmentId
  const appointmentId = Number(id);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<SimplePeer.Instance | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token') || '';
    const userId = token ? JSON.parse(atob(token.split('.')[1])).sub : '';

    const startCall = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const connection = createChatConnection(appointmentId);
        await connection.start();
        console.log('✅ SignalR connected');

        const isInitiator = userId < String(appointmentId); // chỉ định 1 peer làm initiator
        const peer = new SimplePeer({
          initiator: isInitiator,
          trickle: false,
          stream,
        });

        peer.on('signal', (data: SignalData) => {
          console.log('📡 Sending signal:', data);
          sendVideoSignal(String(appointmentId), data);
        });

        peer.on('stream', (remoteStream: MediaStream) => {
          console.log('📺 Remote stream received!');
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        });

        peerRef.current = peer;

        // ⚠️ CHỈ GỌI MỘT LẦN
        onReceiveVideoSignal((_senderId: string, signalData: SignalData) => {
          console.log('📨 Signal received:', signalData);
          if (peerRef.current) {
            peerRef.current.signal(signalData);
          } else {
            console.warn('⚠️ peerRef.current chưa khởi tạo!');
          }
        });
      } catch (error) {
        console.error('🚨 Lỗi khởi tạo video call:', error);
      }
    };

    startCall();

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      peerRef.current?.destroy();
    };
  }, [appointmentId]);

  const toggleMute = () => {
    if (!streamRef.current) return;
    streamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setIsMuted((prev) => !prev);
  };

  const toggleVideo = () => {
    if (!streamRef.current) return;
    streamRef.current.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setIsVideoEnabled((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="h-screen flex flex-col">
        <div className="flex-1 relative bg-black">
          <video
            ref={remoteVideoRef}
            autoPlay
            className="absolute inset-0 w-full h-full object-cover"
          />
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className="absolute bottom-4 right-4 w-48 h-36 rounded-lg border-2 border-white"
          />
        </div>

        <div className="bg-gray-800 p-4">
          <div className="max-w-3xl mx-auto flex items-center justify-center space-x-4">
            <button
              onClick={toggleMute}
              className={`p-4 rounded-full ${
                isMuted ? 'bg-red-500' : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {isMuted ? <MicOff className="h-6 w-6 text-white" /> : <Mic className="h-6 w-6 text-white" />}
            </button>

            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full ${
                !isVideoEnabled ? 'bg-red-500' : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {isVideoEnabled ? <Video className="h-6 w-6 text-white" /> : <VideoOff className="h-6 w-6 text-white" />}
            </button>

            <button className="p-4 rounded-full bg-red-500 hover:bg-red-600">
              <Phone className="h-6 w-6 text-white" />
            </button>

            <button className="p-4 rounded-full bg-gray-600 hover:bg-gray-700">
              <MessageSquare className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
