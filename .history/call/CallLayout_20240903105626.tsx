"use client"
import React, { useEffect, useRef, useState } from 'react';
import styles from './CallLayout.module.css';
import { FaMicrophone, FaPhoneSlash, FaDownload, FaRecordVinyl, FaStopCircle, FaVolumeUp, FaVolumeMute } from 'react-icons/fa'; // Importing icons
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const CallLayout = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [peerConnections, setPeerConnections] = useState<Map<string, RTCPeerConnection>>(new Map());
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false); 
  const [callEnded, setCallEnded] = useState(false); 
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideosRef = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  useEffect(() => {
    socket.on('offer', async (offer: any, id: string) => {
      const pC = new RTCPeerConnection();
      setPeerConnections(prev => new Map(prev).set(id, pC));

      await pC.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await pC.createAnswer();
      await pC.setLocalDescription(answer);
      socket.emit('answer', answer, id);

      pC.ontrack = (event) => {
        const stream = event.streams[0];
        if (remoteVideosRef.current[id]) {
          remoteVideosRef.current[id]!.srcObject = stream;
        }
      };

      pC.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('candidate', event.candidate, id);
        }
      };
    });

    socket.on('answer', async (answer: any, id: string) => {
      const pc = peerConnections.get(id);
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    socket.on('candidate', async (candidate: any, id: string) => {
      const pc = peerConnections.get(id);
      if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    return () => {
      socket.off('offer');
      socket.off('answer');
      socket.off('candidate');
    };
  }, [peerConnections]);

  const startCall = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
    setStream(localStream);

    peerConnections.forEach(pc => {
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
    });
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(prev => !prev); 
  };

  const cancelCall = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    peerConnections.forEach(pc => {
      pc.close();
    });
    setPeerConnections(new Map());

    setStream(null);
    setCallEnded(true);
  };

  const imgUrl = 'https://tse4.mm.bing.net/th?id=OIP.XoAF6zG7WDC10bRHmxu0rQHaEK&pid=Api&P=0&h=180';

  return (
    <div className={styles.container}>
      {callEnded ? (
        <div className={`${styles.callEndedMessage} ${styles.active}`}>
          <div className={styles.profile}>
            <div className={styles.profilePicture}>
              <img src={imgUrl} alt="Profile" />
            </div>
            <h2 className={styles.profileName}>Mani</h2>
          </div>
          <p>Call Ended</p>
        </div>
      ) : (
        <div className={styles.callContainer}>
          <div className={styles.profilePicture}>
            <img src={imgUrl} alt="Profile" />
          </div>
          <div className={styles.callStatus}>
            <h2>
              Mani <span className={styles.heart}>❤️</span>
            </h2>
            <p>Calling...</p>
          </div>
          <div className={styles.controls}>
            <button className={styles.controlBtn} onClick={toggleSpeaker}>
              {isSpeakerOn ? <FaVolumeUp color="white" size={24} /> : <FaVolumeMute color="white" size={24} />}
            </button>
            <button className={`${styles.controlBtn} ${styles.endCall}`} onClick={cancelCall}>
              <FaPhoneSlash color="white" size={24} />
            </button>
          </div>
          <div className={styles.videoContainer}>
            <video ref={localVideoRef} autoPlay muted className={styles.localVideo} />
            {Array.from(peerConnections.keys()).map(id => (
              <video
                key={id}
                ref={el => remoteVideosRef.current[id] = el as HTMLVideoElement}
                autoPlay
                className={styles.remoteVideo}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CallLayout;
