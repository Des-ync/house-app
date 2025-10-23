import React from 'react';

const PropertyCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-slate-200 dark:bg-slate-700"></div>
      <div className="p-4 space-y-3">
        {/* Price Placeholder */}
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
        {/* Address Placeholder */}
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
        {/* Stats Placeholder */}
        <div className="flex items-center gap-4 pt-1">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCardSkeleton;
