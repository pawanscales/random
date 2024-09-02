import styles from './CallLayout.module.css';

const CallLayout = () => {
  return (
    <div className={styles.callContainer}>
      <div className={styles.profilePicture}>
        <img src="https://example.com/profile-picture.jpg" alt="Mani" />
      </div>
      <div className={styles.callStatus}>
        <h2>Mani<span className={styles.heart}>♥</span></h2>
        <p>Calling...</p>
      </div>
      <div className={styles.controls}>
        <button className={styles.controlBtn}>
          <img src="https://example.com/screen-share-icon.png" alt="Screen Share" />
        </button>
        <button className={styles.controlBtn}>
          <img src="https://example.com/video-off-icon.png" alt="Video Off" />
        </button>
        <button className={styles.controlBtn}>
          <img src="https://example.com/microphone-icon.png" alt="Microphone" />
        </button>
        <button className={`${styles.controlBtn} ${styles.endCall}`}>
          <img src="https://example.com/end-call-icon.png" alt="End Call" />
        </button>
      </div>
    </div>
  );
};

export default CallLayout;
