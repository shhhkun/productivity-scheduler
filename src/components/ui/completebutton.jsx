import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CompleteButton({ completed, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`w-5 h-5 flex items-center justify-center rounded-full border transition-all duration-200 
    ${completed ? 'border-[var(--accent)] bg-[var(--accent)]/20' : 'border-[var(--border)] hover:border-[var(--accent)]'}`}
    >
      <AnimatePresence>
        {completed && (
          <motion.div
            key="check"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.2 }}
          >
            <Check className="w-3 h-3 text-[var(--accent)]" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
