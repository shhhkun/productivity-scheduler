import React from 'react';

export default function XpStreakDisplay({ xp, level, streak }) {
  return (
    <div className="flex items-center space-x-4 px-4 py-2 bg-slate-900 bg-opacity-70 rounded-lg glow">
      {/* XP Display */}
      <div className="flex items-center space-x-1 text-yellow-400 font-semibold">
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.561-.955L10 0l2.949 5.955 6.561.955-4.755 4.635 1.123 6.545z" />
        </svg>
        <span>XP: {xp}</span>
        <span>Lvl: {level}</span>
      </div>

      {/* Streak Display */}
      <div className="flex items-center space-x-1 text-red-400 font-semibold">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          className="w-5 h-5"
        >
          <path d="M12 2c.172 2.122-.234 3.09-1.218 3.91C9.905 7.001 9 8.13 9 10a3 3 0 0 0 6 0c0-1.632.817-2.46 1.396-2.97C17.401 6.225 18 5.43 18 4a6 6 0 0 0-6-2Zm0 22a6 6 0 0 0 6-6c0-1.916-1.077-3.581-2.416-4.58A4.992 4.992 0 0 1 12 16a4.992 4.992 0 0 1-3.584-1.58C7.077 14.419 6 16.084 6 18a6 6 0 0 0 6 6Z" />
        </svg>

        <span>
          Streak: {streak} day{streak !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
}
