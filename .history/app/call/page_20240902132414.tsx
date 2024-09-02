import React from 'react';
import styles from './CallLayout.module.css';
import { FaMicrophone, FaVideo, FaPhoneSlash } from 'react-icons/fa'; // Importing icons

const CallLayout = () => {
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
        <button className={styles.controlBtn}>
          <FaMicrophone color="white" size={24} />
        </button>
        <button className={styles.controlBtn}>
          <FaVideo color="white" size={24} />
        </button>
        <button className={`${styles.controlBtn} ${styles.endCall}`}>
          <FaPhoneSlash color="white" size={24} />
        </button>
      </div>
    </div>
  );
};

export default CallLayout;
