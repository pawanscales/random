"use client";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCog, faVideo, faUserCircle, faCalendarAlt, faMicrophone, faMicrophoneSlash, faPhone, faScreenShare, faStopCircle, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import styles from './VideoCall.module.css';
import Modal from 'react-modal';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();  

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

  const endCall = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (peerConnection) {
      peerConnection.close();
    }
    setStream(null);
    setPeerConnection(null);
    setCallStarted(false);
  };

  const handleNotificationClick = () => {
    setNotifications([]);
  };

  const handleBookingClick = () => {
    alert('Booking button clicked!');
  };

  const handleExitClick = () => {
    setIsExitModalOpen(true);
  };

  const handleLeaveMeetingClick = () => {
    setIsLeaveModalOpen(true);
  };

  const handleModalClose = () => {
    setIsExitModalOpen(false);
    setIsLeaveModalOpen(false);
  };

  const handleExitConfirm = () => {
    endCall(); // Ensure call is ended before redirecting
    setIsExitModalOpen(false);
    router.push('/page-1'); // Redirect to /page-1
  };

  const handleLeaveConfirm = () => {
    endCall(); // Ensure call is ended before handling leave
    setIsLeaveModalOpen(false);
    alert('Leaving the meeting...');
    // Optionally redirect or perform other actions here
    router.push('/page-1'); // Optionally redirect to another page
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
          <FontAwesomeIcon icon={faUserCircle} />
        </div>
      </div>
      <div className={styles.videoCallContainer}>
        {callStarted && (
          <div className={styles.videoHeader}>
            <button className={styles.arrowButton} onClick={handleExitClick}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <div className={styles.meetingControls}>
              <button className={styles.leaveMeetingButton} onClick={handleLeaveMeetingClick}>
                Leave Meeting
              </button>
              <span className={styles.meetingName}>{meetingName}</span>
            </div>
          </div>
        )}
        {callStarted && (
          <div className={styles.videoWrapper}>
            <video ref={localVideoRef} autoPlay muted className={styles.video} />
            <video ref={remoteVideoRef} autoPlay className={styles.video} />
          </div>
        )}
        {callStarted && (
          <div className={styles.controls}>
            <button className={`${styles.controlButton} ${styles.whiteButton}`} onClick={handleMuteToggle}>
              <FontAwesomeIcon icon={isMuted ? faMicrophoneSlash : faMicrophone} />
            </button>
            <button className={`${styles.controlButton} ${styles.whiteButton}`} onClick={handleRecordingToggle}>
              <FontAwesomeIcon icon={isRecording ? faStopCircle : faScreenShare} />
            </button>
            <button className={`${styles.controlButton} ${styles.whiteButton}`} onClick={handleScreenShare}>
              <FontAwesomeIcon icon={faScreenShare} />
            </button>
            <button className={`${styles.controlButton} ${styles.whiteButton}`}>
              <FontAwesomeIcon icon={faPhone} />
            </button>
          </div>
        )}
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
        isOpen={isExitModalOpen}
        onRequestClose={handleModalClose}
        className={styles.modal}
        overlayClassName={styles.overlay}>
        <h2>Are you sure you want to exit?</h2>
        <button className={styles.confirmButton} onClick={handleExitConfirm}>Yes</button>
        <button className={styles.cancelButton} onClick={handleModalClose}>No</button>
      </Modal>
      <Modal
        isOpen={isLeaveModalOpen}
        onRequestClose={handleModalClose}
        className={styles.modal}
        overlayClassName={styles.overlay}>
        <h2>Are you sure you want to leave the meeting?</h2>
        <button className={styles.confirmButton} onClick={handleLeaveConfirm}>Yes</button>
        <button className={styles.cancelButton} onClick={handleModalClose}>No</button>
      </Modal>
    </div>
  );
};

export default VideoCall;
