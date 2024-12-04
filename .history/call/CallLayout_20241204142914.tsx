import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import styles from './CallLayout.module.css';
import { FaMicrophone, FaPhoneSlash, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

const CallLayout: React.FC = () => {
  const { user } = useAuth();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [peerConnections, setPeerConnections] = useState<Map<string, RTCPeerConnection>>(new Map());
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; content: string }[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideosRef = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const navigate = useNavigate();

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

    const handleMessage = (message: { sender: string; content: string }) => {
      setMessages(prev => [...prev, message]);
    };

    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('candidate', handleCandidate);
    socket.on('message', handleMessage);

    return () => {
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('candidate', handleCandidate);
      socket.off('message', handleMessage);
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

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = { sender: 'Me', content: newMessage };
      socket.emit('message', message);
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const imgUrl = 'https://tse4.mm.bing.net/th?id=OIP.XoAF6zG7WDC10bRHmxu0rQHaEK&pid=Api&P=0&h=180';

  const handleCallEnd = () => {
    navigate('/page1');
  };

  return (
    <div className={styles.container}>
      {callEnded ? (
        <div className={`${styles.callEndedMessage} ${styles.active}`}>
          <div className={styles.profile}>
            <div className={styles.profilePicture}>
              <img src={imgUrl} alt="Profile" />
            </div>
            <h2 className={styles.profileName}>{user?.name}</h2>
          </div>
          <p>Call Ended</p>
          <button onClick={handleCallEnd}>Go to Page 1</button>
        </div>
      ) : (
        <div className={styles.callContainer}>
          <div className={styles.profilePicture}>
            <img src={imgUrl} alt="Profile" />
          </div>
          <div className={styles.callStatus}>
            <h2>
              {user?.name} <span className={styles.heart}>❤️</span>
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
          <div className={styles.messageContainer}>
            <div className={styles.messages}>
              {messages.map((msg, index) => (
                <div key={index} className={styles.message}>
                  <strong>{msg.sender}:</strong> {msg.content}
                </div>
              ))}
            </div>
            <div className={styles.messageInput}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button onClick={sendMessage}>Send</button>
            </div>
            <div className={styles.preview}>
              <strong>Typing: </strong>{newMessage}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallLayout;
