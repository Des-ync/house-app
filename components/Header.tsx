import React, { useState } from 'react';
import SearchAutocomplete from './SearchAutocomplete';
import SettingsMenu from './SettingsMenu';
import { Spinner } from './icons';

interface HeaderProps {
    onSearch: (location: string) => void;
    isLoading: boolean;
    userEmail: string | null;
    onLogout: () => void;
    isDarkMode: boolean;
    onToggleDarkMode: () => void;
    onClear: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, isLoading, userEmail, onLogout, isDarkMode, onToggleDarkMode, onClear }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    return (
        <header className="flex items-center justify-between p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b dark:border-slate-700 shadow-sm sticky top-0 z-20">
            <div className="flex items-center gap-4">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.496 2.132a1 1 0 00-.992 0l-7 4A1 1 0 003 8v8a1 1 0 001 1h3v-5a1 1 0 011-1h2a1 1 0 011 1v5h3a1 1 0 001-1V8a1 1 0 00-.504-.868l-7-4zM10 18a1 1 0 001-1v-5a1 1 0 00-1-1h-2a1 1 0 00-1 1v5a1 1 0 001 1h2z" clipRule="evenodd" />
                </svg>
                <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 hidden md:block">Gemini Real Estate</h1>
            </div>
            <div className="flex items-center gap-4">
                <SearchAutocomplete onSearch={onSearch} isLoading={isLoading} onClear={onClear} />
                {isLoading && <Spinner />}
            </div>
            <div className="relative">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-2 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                        {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
                    </div>
                </button>
                {isMenuOpen && (
                   <div className="fixed inset-0 z-20" onClick={() => setIsMenuOpen(false)}>
                        <SettingsMenu 
                            onClose={() => setIsMenuOpen(false)}
                            onLogout={onLogout}
                            isDarkMode={isDarkMode}
                            onToggleDarkMode={onToggleDarkMode}
                        />
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
