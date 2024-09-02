import styles from './CallLayout.module.css';

const CallLayout = () => {
  return (
    <div className={styles.callContainer}>
      <div className={styles.profilePicture}>
        <img src="https://cdn.myanimelist.net/images/characters/2/475472.jpg" alt="Mani" />
      </div>
      <div className={styles.callStatus}>
        <h2>Mani<span className={styles.heart}>♥</span></h2>
        <p>Calling...</p>
      </div>
      <div className={styles.controls}>
        <button className={styles.controlBtn}>
          <img src="https://img.icons8.com/color/48/screen-sharing.png" alt="Screen Share" />
        </button>
        <button className={styles.controlBtn}>
          <img src="https://img.icons8.com/color/48/no-video.png" alt="Video Off" />
        </button>
        <button className={styles.controlBtn}>
          <img src="https://img.icons8.com/color/48/microphone.png" alt="Microphone" />
        </button>
        <button className={`${styles.controlBtn} ${styles.endCall}`}>
          <img src="https://img.icons8.com/color/48/end-call.png" alt="End Call" />
        </button>
      </div>
    </div>
  );
};

export default CallLayout;
