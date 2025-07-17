import React from 'react';
import { motion } from 'framer-motion';

const badgeLevels = [
  { level: 'Bronze', threshold: 5, color: 'text-yellow-500' },
  { level: 'Silver', threshold: 15, color: 'text-gray-400' },
  { level: 'Gold', threshold: 30, color: 'text-amber-400' },
  { level: 'Platinum', threshold: 50, color: 'text-blue-300' },
  { level: 'Diamond', threshold: 75, color: 'text-cyan-400' },
  { level: 'Scheduler Sage', threshold: 100, color: 'text-purple-400' },
];

const titleRanks = [
  { title: 'Rookie', threshold: 0, glow: 'text-white' },
  { title: 'Apprentice', threshold: 10, glow: 'text-green-300' },
  { title: 'Adept', threshold: 25, glow: 'text-sky-400' },
  { title: 'Master', threshold: 50, glow: 'text-amber-500' },
  { title: 'Sage', threshold: 100, glow: 'text-purple-400 drop-shadow-lg' },
];

const BadgeDisplay = ({ completedCount }) => {
  const currentBadge = badgeLevels
    .slice()
    .reverse()
    .find((b) => completedCount >= b.threshold) || badgeLevels[0];

  const currentTitle = titleRanks
    .slice()
    .reverse()
    .find((t) => completedCount >= t.threshold) || titleRanks[0];

  return (
    <motion.div
      className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm sm:text-base"
      layout
    >
      <span className={`font-semibold ${currentBadge.color}`}>
        🏅 {currentBadge.level}
      </span>
      <span className={`font-semibold italic ${currentTitle.glow}`}>
        “{currentTitle.title}”
      </span>
    </motion.div>
  );
};

export default BadgeDisplay;