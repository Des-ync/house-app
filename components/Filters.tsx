import React, { useState, useEffect, useRef } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from './icons';

type SortConfig = {
  key: 'price' | 'beds' | 'sqft';
  direction: 'asc' | 'desc';
};

interface FiltersProps {
  onFilterChange: (filters: any) => void;
  currentFilters: {
    maxPrice: number;
    beds: number;
    verified: boolean;
    neighborhoods: string[];
  };
  neighborhoods: string[];
  currencyCode: string;
  sortConfig: SortConfig;
  onSortChange: (config: Partial<SortConfig>) => void;
}

const Filters: React.FC<FiltersProps> = ({ 
    onFilterChange, 
    currentFilters, 
    neighborhoods, 
    currencyCode,
    sortConfig,
    onSortChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (value: number) => new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(value);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...currentFilters, maxPrice: Number(e.target.value) });
  };

  const handleBedsChange = (numBeds: number) => {
    onFilterChange({ ...currentFilters, beds: currentFilters.beds === numBeds ? 0 : numBeds });
  };

  const handleVerifiedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...currentFilters, verified: e.target.checked });
  };
  
  const handleNeighborhoodChange = (neighborhood: string) => {
      const newNeighborhoods = currentFilters.neighborhoods.includes(neighborhood)
        ? currentFilters.neighborhoods.filter(n => n !== neighborhood)
        : [...currentFilters.neighborhoods, neighborhood];
      onFilterChange({ ...currentFilters, neighborhoods: newNeighborhoods });
  }
  
  const handleSortKeyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange({ key: e.target.value as SortConfig['key'] });
  };

  const toggleSortDirection = () => {
    onSortChange({ direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);


  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Price Slider */}
        <div className="lg:col-span-1">
          <label htmlFor="price-range" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Max Price: <span className="font-bold text-blue-600 dark:text-blue-400">{formatCurrency(currentFilters.maxPrice)}</span>
          </label>
          <input
            id="price-range"
            type="range"
            min="50000"
            max="1000000"
            step="25000"
            value={currentFilters.maxPrice}
            onChange={handlePriceChange}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer mt-1"
          />
        </div>

        {/* Beds and Verified */}
        <div className="lg:col-span-1 flex flex-col">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Beds & Features</label>
            <div className="flex items-center gap-2">
                 {[1, 2, 3, 4, 5].map(num => (
                    <button 
                        key={num} 
                        onClick={() => handleBedsChange(num)}
                        className={`px-3 py-1 text-sm rounded-full transition-colors ${currentFilters.beds === num ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'}`}
                    >
                        {num}+
                    </button>
                ))}
                <div className="border-l border-slate-300 dark:border-slate-600 h-6 mx-2"></div>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 dark:text-slate-300">
                    <input type="checkbox" checked={currentFilters.verified} onChange={handleVerifiedChange} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    Verified
                </label>
            </div>
        </div>
        
        {/* Neighborhood Dropdown */}
        <div className="lg:col-span-1 relative" ref={dropdownRef}>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Neighborhood</label>
            <button onClick={() => setIsOpen(!isOpen)} className="w-full text-left bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <span className="block truncate">
                    {currentFilters.neighborhoods.length > 0 ? `${currentFilters.neighborhoods.length} selected` : 'Any'}
                </span>
            </button>
            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-700 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {neighborhoods.map(hood => (
                         <div key={hood} className="px-3 py-2">
                             <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-800 dark:text-slate-200">
                                <input 
                                    type="checkbox" 
                                    checked={currentFilters.neighborhoods.includes(hood)} 
                                    onChange={() => handleNeighborhoodChange(hood)}
                                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                {hood}
                            </label>
                         </div>
                    ))}
                </div>
            )}
        </div>
        
        {/* Sort Controls */}
        <div className="lg:col-span-1">
            <label htmlFor="sort-by" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sort By</label>
            <div className="flex items-center gap-2">
                <select
                    id="sort-by"
                    value={sortConfig.key}
                    onChange={handleSortKeyChange}
                    className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <option value="price">Price</option>
                    <option value="beds">Beds</option>
                    <option value="sqft">Square Feet</option>
                </select>
                <button
                    onClick={toggleSortDirection}
                    className="flex-shrink-0 p-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    title={`Sort ${sortConfig.direction === 'asc' ? 'descending' : 'ascending'}`}
                >
                    {sortConfig.direction === 'asc' ? <ChevronUpIcon className="h-5 w-5 text-slate-700 dark:text-slate-200" /> : <ChevronDownIcon className="h-5 w-5 text-slate-700 dark:text-slate-200" />}
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Filters;