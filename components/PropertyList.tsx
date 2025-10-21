import React from 'react';
import PropertyCard from './PropertyCard';
import type { Property } from '../types';

interface PropertyListProps {
  properties: Property[];
  selectedPropertyId: string | null;
  onCardClick: (id: string) => void;
  onMarkerHover: (id: string | null) => void;
  isLoading: boolean;
  error: string | null;
  onToggleCompare: (property: Property) => void;
  compareList: Property[];
}

const PropertyList: React.FC<PropertyListProps> = ({
  properties,
  selectedPropertyId,
  onCardClick,
  onMarkerHover,
  isLoading,
  error,
  onToggleCompare,
  compareList
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md animate-pulse">
                <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="mt-4 space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                </div>
            </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-8 text-red-500 bg-red-100 dark:bg-red-900/50 rounded-lg">{error}</div>;
  }
  
  if (properties.length === 0) {
      return <div className="text-center p-8 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg">No properties found. Try a different search or clear the drawing on the map.</div>
  }

  return (
    <div className="space-y-3">
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
        />
      ))}
    </div>
  );
};

export default PropertyList;