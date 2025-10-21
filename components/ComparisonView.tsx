import React from 'react';
import type { Property } from '../types';

interface ComparisonViewProps {
  properties: Property[];
  onClose: () => void;
  onRemove: (id: string) => void;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ properties, onClose, onRemove }) => {
  if (properties.length === 0) {
    return null;
  }
  
  const formatCurrency = (value: number, currencyCode: string) => new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(value);

  const features = ['price', 'beds', 'baths', 'sqft', 'type', 'description'];
  const featureLabels: { [key: string]: string } = {
    price: 'Price',
    beds: 'Bedrooms',
    baths: 'Bathrooms',
    sqft: 'Square Feet',
    type: 'Listing Type',
    description: 'Description'
  };

  const renderFeature = (property: Property, feature: string) => {
    if (feature === 'price') return formatCurrency(property.priceMinorUnits / 100, property.currencyCode);
    if (feature === 'sqft') return (property.sqft as number).toLocaleString();
    if (feature === 'description') return <p className="text-sm text-left">{property.description}</p>;
    return property[feature as keyof Property];
  };

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 z-30 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 sticky top-0 bg-white dark:bg-slate-800 border-b dark:border-slate-700 z-10 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Property Comparison</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="grid" style={{ gridTemplateColumns: `minmax(120px, 1fr) repeat(${properties.length}, minmax(200px, 2fr))`}}>
          {/* Empty corner cell */}
          <div className="p-4 border-b border-r dark:border-slate-700 font-semibold sticky top-[77px] bg-white dark:bg-slate-800"></div>
          
          {/* Property Headers */}
          {properties.map(p => (
            <div key={p.id} className="p-4 border-b dark:border-slate-700 text-center sticky top-[77px] bg-white dark:bg-slate-800 relative group">
              <img src={p.imageUrls[0]} alt={p.address} className="w-full h-32 object-cover rounded-md mb-2"/>
              <p className="font-semibold text-slate-700 dark:text-slate-200 truncate">{p.address}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{p.city}, {p.state}</p>
              <button
                onClick={() => onRemove(p.id)}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove"
              >
                &times;
              </button>
            </div>
          ))}

          {/* Feature Rows */}
          {features.map(feature => (
            <React.Fragment key={feature}>
              <div className="p-4 border-b border-r dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 flex items-center">{featureLabels[feature]}</div>
              {properties.map(p => (
                <div key={p.id} className={`p-4 border-b dark:border-slate-700 text-center text-slate-800 dark:text-slate-200 flex items-center justify-center ${feature === 'description' ? 'items-start' : 'items-center'}`}>
                  {renderFeature(p, feature)}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;