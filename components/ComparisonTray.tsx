import React from 'react';
import type { Property } from '../types';

interface ComparisonTrayProps {
  properties: Property[];
  onRemove: (id: string) => void;
  onCompare: () => void;
  onClear: () => void;
}

const ComparisonTray: React.FC<ComparisonTrayProps> = ({ properties, onRemove, onCompare, onClear }) => {
  if (properties.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-2xl z-30 p-4 transform transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-grow">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 hidden sm:block">Compare ({properties.length}/3)</h3>
          <div className="flex gap-2">
            {properties.map(p => (
              <div key={p.id} className="relative group">
                <img src={p.imageUrls[0]} alt={p.address} className="w-16 h-12 object-cover rounded-md border-2 border-white dark:border-slate-700" />
                <button
                  onClick={() => onRemove(p.id)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove"
                >
                  &times;
                </button>
              </div>
            ))}
             {Array.from({ length: 3 - properties.length }).map((_, index) => (
                <div key={`placeholder-${index}`} className="w-16 h-12 rounded-md bg-slate-200 dark:bg-slate-700 border-2 border-dashed border-slate-300 dark:border-slate-600 hidden sm:block"></div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button
            onClick={onClear}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={onCompare}
            disabled={properties.length < 2}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            Compare
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTray;
