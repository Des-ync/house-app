import React from 'react';
import { TrashIcon } from './icons';

interface DeleteAccountModalProps {
  onClose: () => void;
  onConfirmDelete: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ onClose, onConfirmDelete }) => {
  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md" 
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b dark:border-slate-700 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <TrashIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Delete Account</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
        
        <div className="p-6">
            <p className="text-slate-600 dark:text-slate-300">
                Are you sure you want to permanently delete your account? All of your saved properties and settings will be lost. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-6">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600">
                    Cancel
                </button>
                <button 
                    type="button" 
                    onClick={onConfirmDelete} 
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                    Delete Account
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
