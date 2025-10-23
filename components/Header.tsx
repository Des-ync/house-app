import React, { useState } from 'react';
import SearchAutocomplete from './SearchAutocomplete';
import SettingsMenu from './SettingsMenu';
import { Spinner, SunIcon, MoonIcon } from './icons';
import Logo from './Logo';

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
            <div className="flex items-center gap-2">
                <Logo isDarkMode={isDarkMode} className="h-8 w-auto" />
                <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 hidden md:block">Domus</h1>
            </div>
            <div className="flex items-center gap-4">
                <SearchAutocomplete onSearch={onSearch} isLoading={isLoading} onClear={onClear} />
                {isLoading && <Spinner />}
                <button
                    onClick={onToggleDarkMode}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    title="Toggle dark mode"
                >
                    {isDarkMode ? (
                        <SunIcon className="h-6 w-6 text-yellow-400" />
                    ) : (
                        <MoonIcon className="h-6 w-6 text-slate-700" />
                    )}
                </button>
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
                            />
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;