import React from 'react';
import type { Property } from '../types';
import PropertyCard from './PropertyCard';
import { BookmarkIcon } from './icons';

interface SavedPropertiesModalProps {
  properties: Property[];
  onClose: () => void;
  onCardClick: (id: string) => void;
  onToggleCompare: (property: Property) => void;
  compareList: Property[];
  savedProperties: string[];
  onToggleSave: (id: string) => void;
}

const SavedPropertiesModal: React.FC<SavedPropertiesModalProps> = ({ 
    properties, 
    onClose, 
    onCardClick, 
    onToggleCompare, 
    compareList,
    savedProperties,
    onToggleSave
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 z-40 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden" 
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b dark:border-slate-700 flex justify-between items-center flex-shrink-0">
            <div className="flex items-center gap-3">
                <BookmarkIcon className="h-6 w-6 text-slate-700 dark:text-slate-200" />
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Saved Properties</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-4">
            {properties.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 dark:text-slate-400">
                    <BookmarkIcon className="h-16 w-16 text-slate-400 dark:text-slate-500 mb-4" />
                    <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200">No Saved Properties</h3>
                    <p className="mt-2">Click the heart icon on any property to save it here for later.</p>
                </div>
            ) : (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {properties.map(property => (
                        <PropertyCard
                            key={property.id}
                            property={property}
                            isSelected={false} // Not applicable here
                            onCardClick={onCardClick}
                            onMouseEnter={() => {}} // Not applicable here
                            onMouseLeave={() => {}} // Not applicable here
                            onToggleCompare={onToggleCompare}
                            isInCompare={!!compareList.find(p => p.id === property.id)}
                            onToggleSave={onToggleSave}
                            isSaved={savedProperties.includes(property.id)}
                        />
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SavedPropertiesModal;
