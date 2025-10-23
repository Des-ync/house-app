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
      return <div className="text-center p-8 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg mt-4">No properties found. Try a different search or adjust your filters.</div>
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
        />
      ))}
    </div>
  );
};

export default PropertyList;