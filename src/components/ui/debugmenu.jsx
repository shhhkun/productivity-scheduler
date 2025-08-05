import { useState } from 'react';
import { FaCog } from 'react-icons/fa'; // gear icon
import { toast } from '@/components/ui/use-toast';

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

          <button
            style={styles.button}
            onClick={() =>
              toast({
                title: 'Debug Toast',
                description:
                  'This is a test notification triggered from DebugMenu.',
              })
            }
            className="debug-button"
          >
            Trigger Toast
          </button>

          <button
            style={styles.button}
            onClick={() =>
              toast({
                title: 'Error',
                description: 'Something went wrong!',
                variant: 'destructive',
              })
            }
            className="debug-button"
          >
            Trigger Error Toast
          </button>

          {/* Theme toggle buttons */}
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="border border-[var(--hover2)] rounded px-3 py-2"
            style={{
              backgroundColor: 'var(--bg)',
              color: 'var(--text3)',
            }}
          >
            <option value="original">Original</option>
            <option value="dark">Dark</option>
            <option value="dark2">Dark2</option>
            <option value="light">Light</option>
            <option value="light2">Light2</option>
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
    background: 'var(--bg)', // dark panel background
    padding: '1rem',
    border: '2px solid var(--hover2)', // mint border
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  heading: {
    margin: 0,
    color: 'var(--accent)',
    fontSize: '1rem',
    fontWeight: 'medium',
    borderBottom: '1px solid var(--hover2)',
    paddingBottom: '0.5rem',
  },
  button: {
    background: 'var(--bg)',
    color: 'var(--text3)',
    border: '1px solid var(--hover2)',
    padding: '0.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
};
