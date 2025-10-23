import React from 'react';
import Logo from './Logo';

interface LoginPromptModalProps {
  onClose: () => void;
  onLogin: () => void;
}

const LoginPromptModal: React.FC<LoginPromptModalProps> = ({ onClose, onLogin }) => {
  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-8 text-center" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center items-center gap-2 mb-4">
          <Logo className="h-12 w-auto" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Unlock Full Access</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Create an account or sign in to view property details, save your favorites, and get personalized alerts.
        </p>
        <div className="mt-6 space-y-3">
          <button
            onClick={onLogin}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign In or Create Account
          </button>
          <button
            onClick={onClose}
            className="w-full flex justify-center py-3 px-4 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPromptModal;