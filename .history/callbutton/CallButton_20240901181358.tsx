import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faPhone } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';

const CallButtons: React.FC = () => {
  const history = useHistory();

  const handleVideoCall = () => {
    history.push('/video-call'); // Navigate to the video call layout
  };

  const handleAudioCall = () => {
    history.push('/audio-call'); // Navigate to the audio call layout
  };

  return (
    <div style={styles.container}>
      <button style={styles.button} onClick={handleVideoCall}>
        <FontAwesomeIcon icon={faVideo} style={styles.icon} />
        <span style={styles.text}>Video Call</span>
      </button>
      <button style={{ ...styles.button, ...styles.buttonAudio }} onClick={handleAudioCall}>
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
    backgroundColor: '#f0f0f0',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px 25px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: '#007bff', // Default button color
    color: '#fff',
    fontSize: '18px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  buttonAudio: {
    backgroundColor: '#28a745', // Audio call button color
  },
  icon: {
    marginRight: '10px',
    fontSize: '24px', // Adjust the size of the icon if needed
  },
  text: {
    fontSize: '16px',
  },
};

export default CallButtons;
