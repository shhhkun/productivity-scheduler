import { useState } from 'react';
import { FaCog } from 'react-icons/fa'; // gear icon

export default function DebugMenu({ addXP, resetProgress }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={styles.container}>
      <div style={styles.gearWrapper}>
        <button onClick={() => setIsOpen(!isOpen)} style={styles.gearButton}>
          <FaCog color="#ccc" size={20} />
        </button>
      </div>

      {isOpen && (
        <div style={styles.panel}>
          <h3 style={styles.heading}>Debug Menu</h3>
          <button className="debug-button" onClick={() => addXP(10)}>
            +10 XP
          </button>
          <button className="debug-button" onClick={() => addXP(50)}>
            +100 XP
          </button>
          <button className="debug-button" onClick={() => addXP(100)}>
            +500 XP
          </button>
          <button className="debug-button" onClick={resetProgress}>
            Reset Progress
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    top: '1rem',
    right: '1rem',
    zIndex: 9999,
  },
  gearButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  gearWrapper: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  panel: {
    marginTop: '2rem',
    background: '#1e1e1e', // dark panel background
    padding: '1rem',
    border: '1px solid #333',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.6)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  heading: {
    margin: 0,
    color: '#ccc',
    fontSize: '1rem',
    borderBottom: '1px solid #444',
    paddingBottom: '0.5rem',
  },
  button: {
    background: '#333',
    color: '#ccc',
    border: '1px solid #555',
    padding: '0.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
};
