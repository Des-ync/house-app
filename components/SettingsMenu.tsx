import React from 'react';
import { SunIcon, MoonIcon } from './icons';

interface SettingsMenuProps {
  onClose: () => void;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ onClose, onLogout, isDarkMode, onToggleDarkMode }) => {
  return (
    <div 
        className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-30"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
    >
      <div className="py-1">
        <div className="px-4 py-2 text-sm text-slate-700 dark:text-slate-200">
          <p className="font-semibold">Settings</p>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-700"></div>
        <button
          onClick={onToggleDarkMode}
          className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <div className="border-t border-slate-200 dark:border-slate-700"></div>
        <button
          onClick={() => { onLogout(); onClose(); }}
          className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsMenu;
