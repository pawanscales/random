import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCog, faVideo, faUserCircle, faCalendarAlt, faMicrophone, faMicrophoneSlash, faPhone, faScreenShare, faStopCircle, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import styles from './VideoCall.module.css';
import Modal from 'react-modal';

const socket = io('http://localhost:5000');

const VideoCall: React.FC = () => {
  // ... (rest of the component code)

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
        <div className={styles.videoHeader}>
          <button className={styles.arrowButton} onClick={handleExitClick}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div className={styles.meetingControls}>
            <button className={styles.leaveMeetingButton} onClick={handleLeaveMeetingClick}>
              Leave Meeting
            </button>
          </div>
        </div>
        {callStarted && (
          <div className={styles.videoWrapper}>
            <video ref={localVideoRef} autoPlay muted className={styles.video} />
            <video ref={remoteVideoRef} autoPlay className={styles.video} />
          </div>
        )}
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
