export function getLevelXpInfo(xp, level) {
  // Cumulative XP to reach a level
  const getTotalXpForLevel = (lvl) => {
    let total = 0;
    for (let i = 1; i < lvl; i++) {
      total += 100 + (i - 1) * 20;
    }
    return total;
  };

  const xpForCurrentLevel = getTotalXpForLevel(level);
  const xpForNextLevel = getTotalXpForLevel(level + 1);

  const xpToNextLevel = xpForNextLevel - xp;
  const levelProgress =
    ((xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;
  const currentXpInLevel = xp - xpForCurrentLevel;

  return {
    xpToNextLevel,
    levelProgress: Math.max(0, Math.min(levelProgress, 100)),
    currentXpInLevel,
  };
}

// XP required to reach next level (e.g., Level 1: 100, Level 2: 120, etc.)
export const xpForLevel = (level) => 100 + (level - 1) * 20;
