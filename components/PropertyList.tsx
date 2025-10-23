import React from 'react';
import PropertyCard from './PropertyCard';
import type { Property } from '../types';
import PropertyCardSkeleton from './PropertyCardSkeleton';

interface PropertyListProps {
  properties: Property[];
  selectedPropertyId: string | null;
  onCardClick: (id: string) => void;
  onMarkerHover: (id: string | null) => void;
  isLoading: boolean;
  error: string | null;
  onToggleCompare: (property: Property) => void;
  compareList: Property[];
  onClearFilters: () => void;
  activeFilterCount: number;
  savedProperties: string[];
  onToggleSave: (id: string) => void;
}

const PropertyList: React.FC<PropertyListProps> = ({
  properties,
  selectedPropertyId,
  onCardClick,
  onMarkerHover,
  isLoading,
  error,
  onToggleCompare,
  compareList,
  onClearFilters,
  activeFilterCount,
  savedProperties,
  onToggleSave
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
        {[...Array(6)].map((_, i) => (
            <PropertyCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-8 text-red-500 bg-red-100 dark:bg-red-900/50 rounded-lg mt-4">{error}</div>;
  }
  
  if (properties.length === 0) {
      return (
        <div className="text-center p-8 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg mt-4">
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200">No Properties Found</h3>
            <p className="mt-2">We couldn't find any properties matching your current search and filter criteria.</p>
            <p>Try searching in a different area or adjusting your filters.</p>
            {activeFilterCount > 0 && (
                <button 
                    onClick={onClearFilters}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                >
                    Clear Filters ({activeFilterCount})
                </button>
            )}
        </div>
      );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
      {properties.map(property => (
        <PropertyCard
          key={property.id}
          property={property}
          isSelected={property.id === selectedPropertyId}
          onCardClick={onCardClick}
          onMouseEnter={() => onMarkerHover(property.id)}
          onMouseLeave={() => onMarkerHover(null)}
          onToggleCompare={onToggleCompare}
          isInCompare={!!compareList.find(p => p.id === property.id)}
          onToggleSave={onToggleSave}
          isSaved={savedProperties.includes(property.id)}
        />
      ))}
    </div>
  );
};

export default PropertyList;