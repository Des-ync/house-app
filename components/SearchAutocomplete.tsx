import React, { useState } from 'react';

interface SearchAutocompleteProps {
  onSearch: (location: string) => void;
  isLoading: boolean;
  onClear: () => void;
}

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({ onSearch, isLoading, onClear }) => {
  const [location, setLocation] = useState('Accra, Ghana');
  
  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(location.trim()) {
          onSearch(location.trim());
      }
  }

  const handleClear = () => {
      setLocation('Accra, Ghana');
      onClear();
  }

  return (
    <form className="flex items-center gap-2" onSubmit={handleSubmit}>
       <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={isLoading}
            placeholder="Enter a city or address"
            className="px-4 py-2 w-48 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
       <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
      >
        Search
      </button>
      <button
        type="button"
        onClick={handleClear}
        disabled={isLoading}
        className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
      >
        Clear
      </button>
    </form>
  );
};

export default SearchAutocomplete;