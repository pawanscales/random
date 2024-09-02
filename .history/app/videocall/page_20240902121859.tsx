"use client";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCog, faVideo, faUserCircle, faCalendarAlt, faMicrophone, faMicrophoneSlash, faPhone, faScreenShare, faStopCircle, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import styles from './VideoCall.module.css';
import Modal from 'react-modal';

// Initialize socket connection
const socket = io('http://localhost:5000');

const VideoCall: React.FC = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [callStarted, setCallStarted] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [meetingName, setMeetingName] = useState('Meeting Name');

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to signaling server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from signaling server');
    });

    socket.on('offer', async (offer) => {
      const pc = new RTCPeerConnection();
      setPeerConnection(pc);

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('answer', answer);

      pc.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('candidate', event.candidate);
        }
      };
    });

    socket.on('answer', async (answer) => {
      if (peerConnection) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    socket.on('candidate', async (candidate) => {
      if (peerConnection) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socket.on('notification', (message) => {
      setNotifications(prevNotifications => [...prevNotifications, message]);
    });

    return () => {
      socket.off('offer');
      socket.off('answer');
      socket.off('candidate');
      socket.off('notification');
    };
  }, [peerConnection]);

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setStream(stream);

      const pc = new RTCPeerConnection();
      setPeerConnection(pc);

      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('candidate', event.candidate);
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit('offer', offer);
      setCallStarted(true);
    } catch (error) {
      console.error('Error starting call:', error);
    }
  };

  const handleNotificationClick = () => {
    setNotifications([]);
  };

  const handleBookingClick = () => {
    alert('Booking button clicked!');
  };

  const handleExitClick = () => {
    // Redirect to localhost:3000
    window.location.href = 'http://localhost:3000';
  };

  const handleLeaveMeetingClick = () => {
    // Redirect to localhost:3000
    window.location.href = 'http://localhost:3000';
  };

  const handleModalClose = () => {
    setIsExitModalOpen(false);
    setIsLeaveModalOpen(false);
  };

  const handleExitConfirm = () => {
    // Handle exit logic here
    setIsExitModalOpen(false);
    window.location.href = 'http://localhost:3000';
  };

  const handleLeaveConfirm = () => {
    // Handle leave logic here
    setIsLeaveModalOpen(false);
    window.location.href = 'http://localhost:3000';
  };

  const handleMuteToggle = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const handleRecordingToggle = () => {
    setIsRecording(!isRecording);
    // Handle recording logic here
  };

  const handleScreenShare = () => {
    // Handle screen sharing logic here
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.icon} onClick={handleNotificationClick}>
          <FontAwesomeIcon icon={faBell} />
        </div>
        <div className={styles.icon}>
          <FontAwesomeIcon icon={faCog} />
        </div>
        <div className={styles.icon} onClick={startCall}>
          <FontAwesomeIcon icon={faVideo} />
        </div>
        <div className={styles.icon} onClick={handleBookingClick}>
          <FontAwesomeIcon icon={faCalendarAlt} />
        </div>
        <div className={styles.icon} onClick={handleExitClick}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </div>
        <div className={styles.profile}>
          <Font
