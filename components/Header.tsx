import React, { useState } from 'react';
import SearchAutocomplete from './SearchAutocomplete';
import SettingsMenu from './SettingsMenu';
import { Spinner } from './icons';
import Logo from './Logo';
import type { User } from '../types';

interface HeaderProps {
    onSearch: (location: string) => void;
    isLoading: boolean;
    user: User | null;
    onLogout: () => void;
    onGoToLogin: () => void;
    isDarkMode: boolean;
    onClear: () => void;
    searchHistory: string[];
    onShowSavedProperties: () => void;
    onShowEditProfile: () => void;
    onShowChangePassword: () => void;
    onShowDeleteAccount: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
    onSearch, 
    isLoading, 
    user, 
    onLogout, 
    onGoToLogin, 
    isDarkMode, 
    onClear, 
    searchHistory, 
    onShowSavedProperties,
    onShowEditProfile,
    onShowChangePassword,
    onShowDeleteAccount
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    return (
        <header className="flex items-center justify-between p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b dark:border-slate-700 shadow-sm sticky top-0 z-20">
            <div className="flex items-center gap-2">
                <Logo isDarkMode={isDarkMode} className="h-8 w-auto" />
                <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 hidden md:block">Domus</h1>
            </div>
            <div className="flex items-center gap-4">
                <SearchAutocomplete onSearch={onSearch} isLoading={isLoading} onClear={onClear} searchHistory={searchHistory} />
                {isLoading && <Spinner />}
                {user ? (
                    <div className="relative">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-2 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Open user menu">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                                {(user.name || user.email).charAt(0).toUpperCase()}
                            </div>
                        </button>
                        {isMenuOpen && (
                        // Fix: Corrected typo 'setIsMenuОpen' to 'setIsMenuOpen'.
                        <div className="fixed inset-0 z-20" onClick={() => setIsMenuOpen(false)}>
                                <SettingsMenu 
                                    onClose={() => setIsMenuOpen(false)}
                                    onLogout={onLogout}
                                    onShowSavedProperties={onShowSavedProperties}
                                    onShowEditProfile={onShowEditProfile}
                                    onShowChangePassword={onShowChangePassword}
                                    onShowDeleteAccount={onShowDeleteAccount}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={onGoToLogin}
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                    >
                        Sign In
                    </button>
                )}
            </div>
        </header>
    );
}

export default Header;