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

export default function RankBadge({ tier, show }) {
  const style = tierStyles[tier] || 'text-white';
  const title = tierTitles[tier] || '';

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Animated "Rank Up!" Notification */}
      <AnimatePresence>
        {show && (
          <motion.div
            key="rank-up-toast"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="fixed bottom-24 inset-x-0 mx-auto w-fit text-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold px-4 py-2 rounded-full shadow-lg ring-2 ring-purple-300 z-50"
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
        initial={show ? { scale: 0.8, opacity: 0 } : false}
        animate={show ? { scale: 1.1, opacity: 1 } : false}
        exit={show ? { scale: 0.8, opacity: 0 } : false}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {tier}
      </motion.div>

      {/* Title Below Badge */}
      <div className="mt-1 text-xs italic text-gray-400">{title}</div>
    </div>
  );
}
