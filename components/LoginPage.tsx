import React, { useState } from 'react';
import Logo from './Logo';
import { GoogleIcon } from './icons';
import type { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onGuestLogin: () => void;
  isDarkMode: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onGuestLogin, isDarkMode }) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleGoogleLogin = () => {
    // In a real app, this would trigger the Google OAuth flow.
    onLogin({ email: 'user.from.google@example.com', name: 'Google User' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (authMode === 'reset') {
      setIsLoading(true);
      setTimeout(() => {
        setMessage('If an account exists for this email, a password reset link has been sent.');
        setIsLoading(false);
        setAuthMode('signin');
      }, 500);
      return;
    }
    
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    if (authMode === 'signup') {
        if (!name) {
            setError('Please enter your name.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
    }
    
    setIsLoading(true);
    // Simulate network request
    setTimeout(() => {
        if (authMode === 'signup') {
            onLogin({ email, name });
        } else {
            // For sign-in, a real backend would return the full user object.
            onLogin({ email }); 
        }
      setIsLoading(false);
    }, 500);
  };
  
  const resetFormState = () => {
      setError('');
      setMessage('');
      setEmail('');
      setPassword('');
      setName('');
      setConfirmPassword('');
  }

  const renderHeading = () => {
      switch(authMode) {
          case 'signup': return 'Create Account';
          case 'reset': return 'Reset Password';
          default: return 'Sign In';
      }
  }

  const renderSubheading = () => {
      switch(authMode) {
          case 'signup': return 'Get started with your free account.';
          case 'reset': return 'Enter your email to receive a password reset link.';
          default: return 'Sign in to save properties and access your account.';
      }
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-slate-100 dark:bg-slate-900 p-4">
      <div className="w-full max-w-md">
        <Logo isDarkMode={isDarkMode} className="h-12 w-auto mx-auto mb-8" />
        <div className="w-full p-8 space-y-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{renderHeading()}</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{renderSubheading()}</p>
            </div>
            
            {message && <p className="text-green-600 text-sm text-center bg-green-100 dark:bg-green-900/50 p-3 rounded-md">{message}</p>}
            {error && <p className="text-red-600 text-sm text-center bg-red-100 dark:bg-red-900/50 p-3 rounded-md">{error}</p>}
            
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-3">
                    {authMode === 'signup' && (
                        <input
                            name="name"
                            type="text"
                            required
                            className="appearance-none rounded-md relative block w-full px-3 py-3 border border-slate-300 dark:border-slate-600 placeholder-slate-500 text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-700/50 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    )}
                    <input
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="appearance-none rounded-md relative block w-full px-3 py-3 border border-slate-300 dark:border-slate-600 placeholder-slate-500 text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-700/50 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {authMode !== 'reset' && (
                        <input
                            name="password"
                            type="password"
                            autoComplete={authMode === 'signin' ? "current-password" : "new-password"}
                            required
                            className="appearance-none rounded-md relative block w-full px-3 py-3 border border-slate-300 dark:border-slate-600 placeholder-slate-500 text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-700/50 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    )}
                    {authMode === 'signup' && (
                        <input
                            name="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            required
                            className="appearance-none rounded-md relative block w-full px-3 py-3 border border-slate-300 dark:border-slate-600 placeholder-slate-500 text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-700/50 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    )}
                </div>

                {authMode === 'signin' && (
                    <div className="flex items-center justify-end text-sm">
                        <button type="button" onClick={() => { setAuthMode('reset'); resetFormState(); }} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                            Forgot Password?
                        </button>
                    </div>
                )}
              
                <div className="space-y-3 pt-2">
                    <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400" disabled={isLoading}>
                        {isLoading ? 'Loading...' : (authMode === 'signup' ? 'Create Account' : (authMode === 'reset' ? 'Send Reset Link' : 'Sign In'))}
                    </button>
                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
                        <span className="flex-shrink mx-4 text-slate-500 dark:text-slate-400 text-xs">OR</span>
                        <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
                    </div>
                    <button type="button" onClick={handleGoogleLogin} className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <GoogleIcon className="h-5 w-5" />
                        Continue with Google
                    </button>
                    <button type="button" onClick={onGuestLogin} className="group relative w-full flex justify-center py-3 px-4 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Continue as Guest
                    </button>
                </div>
            </form>
            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                {authMode === 'signin' && <>Don't have an account? <button onClick={() => { setAuthMode('signup'); resetFormState(); }} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">Sign Up</button></>}
                {authMode === 'signup' && <>Already have an account? <button onClick={() => { setAuthMode('signin'); resetFormState(); }} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">Sign In</button></>}
                {authMode === 'reset' && <>Remember your password? <button onClick={() => { setAuthMode('signin'); resetFormState(); }} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">Sign In</button></>}
            </p>
          </div>
      </div>
    </div>
  );
};

export default LoginPage;