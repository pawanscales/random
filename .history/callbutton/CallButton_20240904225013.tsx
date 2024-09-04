"use client";

import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faPhone } from '@fortawesome/free-solid-svg-icons';

const CallButtons: React.FC = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div style={styles.container}>
      <button style={{ ...styles.button, ...styles.buttonVideo }} onClick={() => handleNavigation('/videocall')}>
        <FontAwesomeIcon icon={faVideo} style={styles.icon} />
        <span style={styles.text}>Video Call</span>
      </button>
      <button style={{ ...styles.button, ...styles.buttonAudio }} onClick={() => handleNavigation('/audiocall')}>
        <FontAwesomeIcon icon={faPhone} style={styles.icon} />
        <span style={styles.text}>Audio Call</span>
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    height: '100vh',
    backgroundColor: '#fff',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px 25px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#fff',
    fontSize: '18px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  buttonVideo: {
    backgroundColor: '#007bff',
  },
  buttonAudio: {
    backgroundColor: '#28a745',
  },
  icon: {
    marginRight: '10px',
    fontSize: '24px',
  },
  text: {
    fontSize: '16px',
  },
};

export default CallButtons;
