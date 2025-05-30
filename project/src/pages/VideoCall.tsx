import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Mic, MicOff, Video, VideoOff, Phone, MessageSquare } from 'lucide-react';
import Button from '../components/Button';
import { doctors } from '../data/doctors';

const VideoCall: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  
  const doctor = doctors.find(d => d.id === id);
  
  if (!doctor) {
    return <div>Không tìm thấy bác sĩ</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="h-screen flex flex-col">
        {/* Main video area */}
        <div className="flex-1 relative">
          {/* Doctor's video */}
          <div className="absolute inset-0">
            <img 
              src={doctor.image}
              alt={doctor.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Patient's video */}
          <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
            <div className="w-full h-full bg-gray-700"></div>
          </div>
        </div>
        
        {/* Controls */}
        <div className="bg-gray-800 p-4">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-white">
                <p className="font-medium">{doctor.name}</p>
                <p className="text-sm text-gray-400">{doctor.specialty}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-4 rounded-full ${
                  isMuted ? 'bg-red-500' : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {isMuted ? (
                  <MicOff className="h-6 w-6 text-white" />
                ) : (
                  <Mic className="h-6 w-6 text-white" />
                )}
              </button>
              
              <button
                onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                className={`p-4 rounded-full ${
                  !isVideoEnabled ? 'bg-red-500' : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {isVideoEnabled ? (
                  <Video className="h-6 w-6 text-white" />
                ) : (
                  <VideoOff className="h-6 w-6 text-white" />
                )}
              </button>
              
              <button
                className="p-4 rounded-full bg-red-500 hover:bg-red-600"
              >
                <Phone className="h-6 w-6 text-white" />
              </button>
              
              <button
                className="p-4 rounded-full bg-gray-600 hover:bg-gray-700"
              >
                <MessageSquare className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;