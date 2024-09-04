"use client";

import React, { useEffect, useRef, useState } from 'react';
import styles from './CallLayout.module.css';
import { FaMicrophone, FaPhoneSlash, FaDownload, FaRecordVinyl, FaStopCircle, FaVolumeUp, FaVolumeMute } from 'react-icons/fa'; 
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const CallLayout: React.FC = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [peerConnections, setPeerConnections] = useState<Map<string, RTCPeerConnection>>(new Map());
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideosRef = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  useEffect(() => {
    const handleOffer = async (offer: any, id: string) => {
      const pc = new RTCPeerConnection();
      setPeerConnections(prev => new Map(prev).set(id, pc));

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('answer', answer, id);

      pc.ontrack = (event) => {
        if (remoteVideosRef.current[id]) {
          remoteVideosRef.current[id]!.srcObject = event.streams[0];
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('candidate', event.candidate, id);
        }
      };
    };

    const handleAnswer = async (answer: any, id: string) => {
      const pc = peerConnections.get(id);
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      }
    };

    const handleCandidate = async (candidate: any, id: string) => {
      const pc = peerConnections.get(id);
      if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    };

    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('candidate', handleCandidate);

    return () => {
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('candidate', handleCandidate);
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
                ref={el => remoteVideosRef.current[id] = el}
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
