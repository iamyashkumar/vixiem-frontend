import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, endpointName, title, message }) => {
  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-[#0D0D10] border border-slate-200 dark:border-slate-800 p-8 w-full max-w-md shadow-2xl rounded-2xl relative overflow-hidden group"
        >
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
              <AlertTriangle className="text-rose-500" size={28} />
            </div>
            <button 
              onClick={onClose} 
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl transition-all border border-slate-200 dark:border-slate-700"
            >
              <X size={20} />
            </button>
          </div>
          
          <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-3 tracking-tight relative z-10">
            {title || "Delete Endpoint?"}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 font-light mb-8 relative z-10 text-sm leading-relaxed">
            {message || (
              <>
                Are you sure you want to delete <span className="text-slate-900 dark:text-white font-semibold">{endpointName}</span>? 
                This action cannot be undone and will permanently remove all associated monitoring logs.
              </>
            )}
          </p>
          
          <div className="flex justify-end gap-3 relative z-10">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 font-medium text-sm transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2.5 rounded-xl bg-rose-600 text-white hover:bg-rose-500 font-medium shadow-md shadow-rose-600/20 transition-all text-sm"
            >
              Yes, Delete
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default ConfirmDeleteModal;
