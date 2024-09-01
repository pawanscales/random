import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faPhone } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; 

const CallButtons: React.FC = () =
  const navigate = useNavigate(); 

  const handleVideoCall = () => {
    navigate('/video-call'); // Updated method for navigation
  };

  const handleAudioCall = () => {
    navigate('/audio-call'); // Updated method for navigation
  };

  return (
    <div style={styles.container}>
      <button style={styles.button} onClick={handleVideoCall}>
        <FontAwesomeIcon icon={faVideo} style={styles.icon} />
        <span style={styles.text}>Video Call</span>
      </button>
      <button style={styles.button} onClick={handleAudioCall}>
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
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '18px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
  buttonAudio: {
    backgroundColor: '#28a745',
  },
  icon: {
    marginRight: '10px',
  },
  text: {
    fontSize: '16px',
  },
};

export default CallButtons;
