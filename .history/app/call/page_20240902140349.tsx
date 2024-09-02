import React, { useEffect, useRef, useState } from 'react';
import styles from './CallLayout.module.css';
import { FaMicrophone, FaVideo, FaPhoneSlash, FaDownload, FaRecordVinyl } from 'react-icons/fa'; // Importing icons
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const CallLayout = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [peerConnections, setPeerConnections] = useState<Map<string, RTCPeerConnection>>(new Map());
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudiosRef = useRef<{ [key: string]: HTMLAudioElement | null }>({});

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
        if (remoteAudiosRef.current[id]) {
          remoteAudiosRef.current[id]!.srcObject = stream;
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
    const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (localAudioRef.current) {
      localAudioRef.current.srcObject = localStream;
    }
    setStream(localStream);

    peerConnections.forEach(pc => {
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
    });
  };

  const startRecording = () => {
    if (stream) {
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      recorder.ondataavailable = event => {
        if (event.data.size > 0) {
          setRecordedChunks(prev => [...prev, event.data]);
        }
      };
      recorder.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const downloadRecording = () => {
    const blob = new Blob(recordedChunks, { type: 'audio/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recording.webm';
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleMute = (trackId: string) => {
    const pc = peerConnections.get(trackId);
    if (pc) {
      pc.getSenders().forEach(sender => {
        if (sender.track) {
          sender.track.enabled = !sender.track.enabled;
        }
      });
    }
  };

  return (
    <div className={styles.callContainer}>
      <div className={styles.profilePicture}>
        <img src="https://your-image-url.com/profile-picture.jpg" alt="Profile" />
      </div>
      <div className={styles.callStatus}>
        <h2>
          Mani <span className={styles.heart}>❤️</span>
        </h2>
        <p>Calling...</p>
      </div>
      <div className={styles.controls}>
        <button className={styles.controlBtn} onClick={startCall}>
          <FaMicrophone color="white" size={24} />
        </button>
        <button className={styles.controlBtn}>
          <FaVideo color="white" size={24} />
        </button>
        <button className={`${styles.controlBtn} ${styles.endCall}`} onClick={() => console.log('End Call')}>
          <FaPhoneSlash color="white" size={24} />
        </button>
        <button className={`${styles.controlBtn} ${isRecording ? styles.recording : ''}`} onClick={isRecording ? stopRecording : startRecording}>
          <FaRecordVinyl color="white" size={24} />
        </button>
        <button className={styles.controlBtn} onClick={downloadRecording}>
          <FaDownload color="white" size={24} />
        </button>
      </div>
      <audio ref={localAudioRef} autoPlay muted />
      {Array.from(peerConnections.keys()).map(id => (
        <audio
          key={id}
          ref={el => remoteAudiosRef.current[id] = el as HTMLAudioElement}
          autoPlay
        />
      ))}
    </div>
  );
};

export default CallLayout;
