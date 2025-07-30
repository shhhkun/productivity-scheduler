import { useEffect, useState } from 'react';

export default function useClock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return currentTime;
}
