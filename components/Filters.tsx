import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronUpIcon, ChevronDownIcon, FilterIcon } from './icons';

type SortConfig = {
  key: 'price' | 'beds' | 'sqft';
  direction: 'asc' | 'desc';
};

interface FiltersProps {
  onFilterChange: (filters: any) => void;
  currentFilters: {
    maxPrice: number;
    beds: number;
    baths: number;
    type: 'Any' | 'For Sale' | 'For Rent';
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
  const [isNeighborhoodOpen, setIsNeighborhoodOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (value: number) => new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(value);
  
  const handleSortKeyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange({ key: e.target.value as SortConfig['key'] });
  };

  const toggleSortDirection = () => {
    onSortChange({ direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' });
  };

  const handleNeighborhoodChange = (neighborhood: string) => {
      const newNeighborhoods = currentFilters.neighborhoods.includes(neighborhood)
        ? currentFilters.neighborhoods.filter(n => n !== neighborhood)
        : [...currentFilters.neighborhoods, neighborhood];
      onFilterChange({ neighborhoods: newNeighborhoods });
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNeighborhoodOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const activeFilterCount = useMemo(() => {
    const { maxPrice, beds, baths, type, verified, neighborhoods } = currentFilters;
    let count = 0;
    if (maxPrice < 1000000) count++;
    if (beds > 0) count++;
    if (baths > 0) count++;
    if (type !== 'Any') count++;
    if (verified) count++;
    if (neighborhoods.length > 0) count++;
    return count;
  }, [currentFilters]);


  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm mb-4">
       <button 
        onClick={() => setIsFiltersOpen(!isFiltersOpen)}
        className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <FilterIcon />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="ml-1 bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            {activeFilterCount}
          </span>
        )}
      </button>

      {isFiltersOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end mt-4 border-t border-slate-200 dark:border-slate-700 pt-4">
            {/* Price Slider */}
            <div>
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
                onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer mt-1"
            />
            </div>

            {/* Beds & Baths */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Beds & Baths</label>
                <div className="flex items-center gap-2">
                    <select
                        name="beds"
                        value={currentFilters.beds}
                        onChange={(e) => onFilterChange({ beds: Number(e.target.value) })}
                        className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <option value="0">Beds (Any)</option>
                        {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}+</option>)}
                    </select>
                    <select
                        name="baths"
                        value={currentFilters.baths}
                        onChange={(e) => onFilterChange({ baths: Number(e.target.value) })}
                        className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <option value="0">Baths (Any)</option>
                        {[1, 2, 3, 4].map(v => <option key={v} value={v}>{v}+</option>)}
                    </select>
                </div>
            </div>
            
            {/* Type & Features */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type & Features</label>
                <div className="flex items-center gap-2">
                    <select
                        name="type"
                        value={currentFilters.type}
                        onChange={(e) => onFilterChange({ type: e.target.value })}
                        className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <option value="Any">Any Type</option>
                        <option value="For Sale">For Sale</option>
                        <option value="For Rent">For Rent</option>
                    </select>
                    <label className="flex-shrink-0 flex items-center gap-2 cursor-pointer text-sm text-slate-700 dark:text-slate-300 p-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm">
                        <input type="checkbox" checked={currentFilters.verified} onChange={(e) => onFilterChange({ verified: e.target.checked })} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                        Verified
                    </label>
                </div>
            </div>
            
            {/* Neighborhood Dropdown */}
            <div className="relative" ref={dropdownRef}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Neighborhood</label>
                <button onClick={() => setIsNeighborhoodOpen(!isNeighborhoodOpen)} className="w-full text-left bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <span className="block truncate">
                        {currentFilters.neighborhoods.length > 0 ? `${currentFilters.neighborhoods.length} selected` : 'Any'}
                    </span>
                </button>
                {isNeighborhoodOpen && (
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
            <div>
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
      )}
    </div>
  );
};

export default Filters;