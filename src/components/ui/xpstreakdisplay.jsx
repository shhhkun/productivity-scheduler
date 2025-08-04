export default function XpStreakDisplay({ xp, level, xpToNextLevel, levelProgress }) {
  const xpPercent = levelProgress;

  return (
    <div className="flex flex-col space-y-2 px-4 py-3 rounded-lg w-full max-w-md">
      {/* Top Row: XP + Level */}
      <div className="flex justify-between items-center font-semibold"
      style={{
        color: 'var(--accent)'
      }}>
        <span>XP: {xp}</span>
        <span>Level: {level}</span>
      </div>

      {/* XP Progress Bar */}
      <div className="w-full h-3 rounded-full overflow-hidden"
      style={{
        backgroundColor: 'var(--card-bg)'
      }}>
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${xpPercent}%`,
            background: 'linear-gradient(to right, var(--accent), var(--hover))', // may remove gradient for solid color or adjust as needed
          }}
        />
      </div>

      {/* Bottom Row: XP to Next Level */}
      <div className="text-xs text-right"
      style={{
        color: 'var(--text4)'
      }}>
        {xpToNextLevel} XP to next level
      </div>
    </div>
  );
}
