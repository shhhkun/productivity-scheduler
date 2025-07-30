import { useState, useEffect, useRef } from 'react';

export default function useConfetti(level, userDataLoaded) {
  const [showConfetti, setShowConfetti] = useState(false);

  // confetti effect on level up
  const prevLevel = useRef(null);

  useEffect(() => {
    if (!userDataLoaded) return; // prevent effect from running until user data is loaded

    if (prevLevel.current === null) {
      // first time after load, just set prevLevel without triggering confetti
      prevLevel.current = level;
      return;
    }

    if (level > prevLevel.current) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 4000);

      prevLevel.current = level; // move this here so it updates BEFORE returning cleanup

      return () => clearTimeout(timer);
    }
    prevLevel.current = level; // keep this for the else case (optional)
  }, [level, userDataLoaded]);

  return showConfetti;
}
