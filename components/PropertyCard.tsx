import React from 'react';
import type { Property } from '../types';
import { VerifiedIcon, HeartIcon } from './icons';
import { formatMoney } from '../utils/currency';
import Tooltip from './Tooltip';

interface PropertyCardProps {
  property: Property;
  isSelected: boolean;
  onCardClick: (id: string) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onToggleCompare: (property: Property) => void;
  isInCompare: boolean;
  onToggleSave: (id: string) => void;
  isSaved: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isSelected,
  onCardClick,
  onMouseEnter,
  onMouseLeave,
  onToggleCompare,
  isInCompare,
  onToggleSave,
  isSaved
}) => {
    
  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-200 ${isSelected ? 'ring-2 ring-blue-500 shadow-xl' : 'hover:shadow-lg'}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative">
        <img 
            src={property.imageUrls[0]} 
            alt={property.address} 
            className="w-full h-48 object-cover" 
            onClick={() => onCardClick(property.id)} 
            loading="lazy"
        />
        <div 
            className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold text-white rounded-full ${property.type === 'For Sale' ? 'bg-green-600' : 'bg-blue-600'}`}>
            {property.type}
        </div>
        <div className="absolute top-2 left-2 flex flex-col gap-2">
            <div className="relative group">
                <button 
                    onClick={(e) => { e.stopPropagation(); onToggleSave(property.id); }}
                    aria-label={isSaved ? "Unsave property" : "Save property"}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isSaved ? 'bg-red-500 text-white' : 'bg-white/70 dark:bg-slate-700/70 hover:bg-white dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100'}`}
                >
                   <HeartIcon className="h-5 w-5" isFilled={isSaved} />
                </button>
                <Tooltip text={isSaved ? "Unsave property" : "Save property"} />
            </div>
        </div>
        <div className="absolute bottom-2 right-2 relative group">
            <button 
                onClick={(e) => { e.stopPropagation(); onToggleCompare(property); }}
                aria-label={isInCompare ? "Remove from comparison" : "Add to comparison"}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isInCompare ? 'bg-blue-600 text-white' : 'bg-white/70 dark:bg-slate-700/70 hover:bg-white dark:hover:bg-slate-700'}`}
            >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" /></svg>
            </button>
            <Tooltip text={isInCompare ? "Remove from comparison" : "Add to comparison"} />
        </div>
      </div>
      <div className="p-4" onClick={() => onCardClick(property.id)}>
        <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{formatMoney(property.priceMinorUnits, property.currencyCode)}</p>
        <div className="flex items-center gap-2">
            <p className="text-slate-600 dark:text-slate-300 truncate">{property.address}</p>
            {property.verified && <VerifiedIcon className="h-5 w-5 text-blue-500" />}
        </div>
        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
          <span><span className="font-semibold text-slate-700 dark:text-slate-200">{property.beds}</span> bed</span>
          <span><span className="font-semibold text-slate-700 dark:text-slate-200">{property.baths}</span> bath</span>
          <span><span className="font-semibold text-slate-700 dark:text-slate-200">{property.sqft.toLocaleString()}</span> sqft</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;