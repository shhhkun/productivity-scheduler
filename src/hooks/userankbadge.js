import { useEffect, useState } from 'react';

const badgeLevels = [
  { level: 'Bronze', threshold: 5 },
  { level: 'Silver', threshold: 15 },
  { level: 'Gold', threshold: 30 },
  { level: 'Platinum', threshold: 50 },
  { level: 'Diamond', threshold: 75 },
  { level: 'Scheduler Sage', threshold: 100 },
];

// badge/rank up effect
export default function useRankBadge(level) {
  // rank badge states for tier and rank up animation
  const [currentTier, setCurrentTier] = useState('');

  useEffect(() => {
    const newTier = badgeLevels.reduce((acc, badge) => {
      return level >= badge.threshold ? badge.level : acc;
    }, '');

    if (newTier !== currentTier) {
      setCurrentTier(newTier);
    }
  }, [level]);

  return currentTier;
}
