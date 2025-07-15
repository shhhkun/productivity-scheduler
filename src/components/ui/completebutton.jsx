import { Check } from 'lucide-react';

export default function CompleteButton({ completed, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`w-5 h-5 flex items-center justify-center rounded-full border-2 transition
        ${completed ? 'bg-mint-500 border-mint-500' : 'border-white/40 hover:border-mint-300'}`}
    >
      {completed && <Check className="w-3 h-3 text-gray-900" />}
    </button>
  );
}