import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

const VideoCall: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const roomName = `appointment-${id}`;
  const jitsiContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const domain = 'meet.jit.si';
    const options = {
      roomName,
      width: '100%',
      height: '100%',
      parentNode: jitsiContainerRef.current,
      userInfo: {
        displayName: 'Bạn',
      },
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
      },
      interfaceConfigOverwrite: {
        TILE_VIEW_MAX_COLUMNS: 1,
      }
    };

    const jitsiApi = new window.JitsiMeetExternalAPI(domain, options);

    return () => {
      jitsiApi.dispose();
    };
  }, [roomName]);

  return (
    <div className="min-h-screen bg-black">
      <div ref={jitsiContainerRef} className="w-full h-screen" />
    </div>
  );
};

export default VideoCall;
