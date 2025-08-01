export default function XpStreakDisplay({ xp, level, xpToNextLevel, levelProgress }) {
  const xpPercent = levelProgress;

  return (
    <div className="flex flex-col space-y-2 px-4 py-3 bg-slate-900 bg-opacity-70 rounded-lg w-full max-w-md">
      {/* Top Row: XP + Level */}
      <div className="flex justify-between items-center text-mint-300 font-semibold">
        <span>XP: {xp}</span>
        <span>Level: {level}</span>
      </div>

      {/* XP Progress Bar */}
      <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${xpPercent}%`,
            background: 'linear-gradient(to right, rgba(167,243,208,1), rgba(94,234,212,0.8))',
          }}
        />
      </div>

      {/* Bottom Row: XP to Next Level */}
      <div className="text-xs text-slate-400 text-right">
        {xpToNextLevel} XP to next level
      </div>
    </div>
  );
}
