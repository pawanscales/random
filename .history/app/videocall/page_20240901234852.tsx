"use client";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCog, faVideo, faUserCircle, faCalendarAlt, faMicrophone, faMicrophoneSlash, faPhone, faScreenShare, faStopCircle, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import styles from './VideoCall.module.css';
import Modal from 'react-modal';

const socket = io('http://localhost:5000');

const VideoCall: React.FC = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [callStarted, setCallStarted] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleExitConfirm = () => {
    // Handle exit logic here
    setIsModalOpen(false);
    alert('Exiting the meeting...');
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
      {callStarted && (
        <div className={styles.videoCallContainer}>
          <div className={styles.videoHeader}>
            <button className={styles.backButton}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <div className={styles.meetingInfo}>
              <div className={styles.meetingName}>{meetingName}</div>
              <div className={styles.participants}>Total Participants: 3</div>
            </div>
            <button className={styles.exitButton} onClick={handleExitClick}>
              <FontAwesomeIcon icon={faPhone} />
            </button>
          </div>
          <div className={styles.videoWrapper}>
            <video ref={localVideoRef} autoPlay muted className={styles.video} />
            <video ref={remoteVideoRef} autoPlay className={styles.video} />
          </div>
          <div className={styles.controls}>
            <button className={styles.controlButton} onClick={handleMuteToggle}>
              <FontAwesomeIcon icon={isMuted ? faMicrophoneSlash : faMicrophone} />
            </button>
            <button className={styles.controlButton} onClick={handleRecordingToggle}>
              <FontAwesomeIcon icon={isRecording ? faStopCircle : faScreenShare} />
            </button>
            <button className={styles.controlButton} onClick={handleScreenShare}>
              <FontAwesomeIcon icon={faScreenShare} />
            </button>
            <button className={styles.controlButton}>
              <FontAwesomeIcon icon={faPhone} />
            </button>
          </div>
        </div>
      )}
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
        <div className={styles.profile}>
          <FontAwesomeIcon icon={faUserCircle} />
        </div>
      </div>
      {notifications.length > 0 && (
        <div className={styles.notifications}>
          {notifications.map((notification, index) => (
            <div key={index} className={styles.notification}>
              {notification}
            </div>
          ))}
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        className={styles.modal}
        overlayClassName={styles.overlay}>
        <h2>Are you sure you want to exit?</h2>
        <button onClick={handleExitConfirm}>Yes</button>
        <button onClick={handleModalClose}>No</button>
      </Modal>
    </div>
  );
};

export default VideoCall;
