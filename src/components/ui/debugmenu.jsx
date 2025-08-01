import { useState } from 'react';
import { FaCog } from 'react-icons/fa'; // gear icon

export default function DebugMenu({
  addXP,
  resetProgress,
  logOut,
  theme,
  setTheme,
}) {
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
          <button style={styles.button} onClick={() => addXP(10)}>
            +10 XP
          </button>
          <button style={styles.button} onClick={() => addXP(10)}>
            +100 XP
          </button>
          <button style={styles.button} onClick={() => addXP(500)}>
            +500 XP
          </button>
          <button style={styles.button} onClick={resetProgress}>
            Reset Progress
          </button>

          {/* Theme toggle buttons */}
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="bg-[var(--card-bg)] text-[var(--text)] border border-[var(--border)] rounded px-3 py-2"
          >
            <option value="original">Original</option>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>

          {/* logout button */}
          <button style={styles.button} onClick={logOut}>
            Log Out
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
    background: 'rgb(17, 24, 39)', // dark panel background
    padding: '1rem',
    border: '2px solid rgb(120,130,140)', // mint border
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  heading: {
    margin: 0,
    color: 'rgb(167, 243, 208)',
    fontSize: '1rem',
    borderBottom: '1px solid #444',
    paddingBottom: '0.5rem',
  },
  button: {
    background: 'rgb(17, 24, 39)',
    color: '#ccc',
    border: '1px solid #555',
    padding: '0.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
};
