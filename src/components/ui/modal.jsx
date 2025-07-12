// implement modal transition/popup of add task form
// src/components/ui/modal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Modal({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Modal content container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="bg-gray-900 rounded-xl shadow-xl max-w-2xl w-full p-6 relative z-10"
          >
            {children}
          </motion.div>

          {/* Optional backdrop click to close */}
          <div className="absolute inset-0" onClick={onClose}></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
