import React, { useState, useRef, useEffect } from 'react';

interface SearchAutocompleteProps {
  onSearch: (location: string) => void;
  isLoading: boolean;
  onClear: () => void;
  searchHistory: string[];
}

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({ onSearch, isLoading, onClear, searchHistory }) => {
  const [location, setLocation] = useState('Accra, Ghana');
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsHistoryVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(location.trim()) {
          onSearch(location.trim());
      }
      setIsHistoryVisible(false);
  }

  const handleClear = () => {
      setLocation('Accra, Ghana');
      onClear();
      setIsHistoryVisible(false);
  }

  const handleHistoryClick = (historyLocation: string) => {
    setLocation(historyLocation);
    onSearch(historyLocation);
    setIsHistoryVisible(false);
  }

  return (
    <div className="relative" ref={searchContainerRef}>
      <form className="flex items-center gap-2" onSubmit={handleSubmit}>
        <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onFocus={() => setIsHistoryVisible(true)}
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
      {isHistoryVisible && searchHistory.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-800 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black dark:ring-slate-600 ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              <p className="px-4 pt-2 pb-1 text-xs font-semibold text-slate-500 dark:text-slate-400">Recent Searches</p>
              <ul>
                  {searchHistory.map((item, index) => (
                      <li key={index}>
                          <button
                              type="button"
                              className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                              onClick={() => handleHistoryClick(item)}
                          >
                              {item}
                          </button>
                      </li>
                  ))}
              </ul>
          </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;