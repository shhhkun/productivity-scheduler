import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const tierStyles = {
  Bronze: 'text-yellow-700 border-yellow-700',
  Silver: 'text-gray-400 border-gray-400',
  Gold: 'text-yellow-400 border-yellow-400',
  Platinum: 'text-blue-300 border-blue-300',
  Diamond: 'text-cyan-400 border-cyan-400',
  'Scheduler Sage': 'text-purple-400 border-purple-400',
};

const tierTitles = {
  Bronze: 'Rookie',
  Silver: 'Apprentice',
  Gold: 'Adept',
  Platinum: 'Time Strategist',
  Diamond: 'Task Legend',
  'Scheduler Sage': 'Sage',
};

export default function RankBadge({ tier, userDataLoaded }) {
  const [showRankUp, setShowRankUp] = useState(false);
  const prevTier = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!userDataLoaded) return; // prevent effect from running until user data is loaded

    if (prevTier.current === null) {
      // first time after load, just set prevTier without triggering rank up
      prevTier.current = tier;
      return;
    }

    if (tier && tier !== prevTier.current) {
      setShowRankUp(true);

      // Clear any existing timeout
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        setShowRankUp(false);
        timerRef.current = null;
      }, 2500);

      prevTier.current = tier;
    }
  }, [tier, userDataLoaded]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const style = tierStyles[tier] || 'border-[var(--bg)]';
  const title = tierTitles[tier] || '';

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Animated "Rank Up!" Notification */}
      <AnimatePresence>
        {showRankUp && (
          <motion.div
            key="rank-up-toast"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="fixed bottom-24 inset-x-0 mx-auto w-fit text-center border border-[var(--accent)] font-bold px-4 py-2 rounded-full shadow-lg z-50"
            style={{ 
              backgroundColor: 'var(--bg)',
              color: 'var(--text3)',
            }}
          >
            🎉 Rank Up to {tier}!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badge Pill */}
      <motion.div
        key={tier}
        className={cn(
          'px-4 py-2 rounded-full border font-semibold shadow-sm text-sm text-center',
          style
        )}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {tier}
      </motion.div>

      {/* Title Below Badge */}
      <div className="mt-1 text-xs italic text-gray-400"
      style={{
        color: 'var(--text3)'  
      }}
      >
        {title}
      </div>
    </div>
  );
}
