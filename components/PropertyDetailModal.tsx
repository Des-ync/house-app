import React, { useState } from 'react';
import type { Property } from '../types';
import { VerifiedIcon, WhatsappIcon, EmailIcon, PhoneIcon, HeartIcon } from './icons';
import MortgageCalculator from './MortgageCalculator';
import { formatMoney } from '../utils/currency';
import Tooltip from './Tooltip';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}

const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({ property, onClose, isSaved, onToggleSave }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!property) return null;

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % property.imageUrls.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + property.imageUrls.length) % property.imageUrls.length);
  };


  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 z-40 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden" 
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b dark:border-slate-700 flex justify-between items-center flex-shrink-0">
            <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{property.address}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{property.city}, {property.state}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
        
        <div className="flex-grow overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                {/* Image Carousel */}
                <div className="relative">
                    <img src={property.imageUrls[currentImageIndex]} alt={`Property at ${property.address}`} className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg shadow-md" loading="lazy" />
                     <div className="absolute inset-0 flex items-center justify-between p-2">
                        <button onClick={prevImage} className="bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button onClick={nextImage} className="bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                     <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                        {property.imageUrls.map((_, index) => (
                            <div key={index} className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}></div>
                        ))}
                    </div>
                </div>

                {/* Property Details */}
                <div className="space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                             <p className={`px-2 py-1 text-xs font-bold text-white rounded-full inline-block ${property.type === 'For Sale' ? 'bg-green-600' : 'bg-blue-600'}`}>
                                {property.type}
                            </p>
                            <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-2">{formatMoney(property.priceMinorUnits, property.currencyCode)}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            {property.verified && (
                                <div className="flex items-center gap-1 text-blue-500 font-semibold text-sm">
                                    <VerifiedIcon className="h-5 w-5" />
                                    <span>Verified</span>
                                </div>
                            )}
                            <div className="relative group">
                                <button 
                                    onClick={() => onToggleSave(property.id)}
                                    aria-label={isSaved ? "Unsave property" : "Save property"}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isSaved ? 'bg-red-100 dark:bg-red-900/20 text-red-500' : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300'}`}
                                >
                                <HeartIcon className="h-6 w-6" isFilled={isSaved} />
                                </button>
                                <Tooltip text={isSaved ? "Unsave property" : "Save property"} />
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-around gap-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-center">
                        <div><p className="font-bold text-xl text-slate-700 dark:text-slate-200">{property.beds}</p><p className="text-sm text-slate-500 dark:text-slate-400">Beds</p></div>
                        <div><p className="font-bold text-xl text-slate-700 dark:text-slate-200">{property.baths}</p><p className="text-sm text-slate-500 dark:text-slate-400">Baths</p></div>
                        <div><p className="font-bold text-xl text-slate-700 dark:text-slate-200">{property.sqft.toLocaleString()}</p><p className="text-sm text-slate-500 dark:text-slate-400">Sqft</p></div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-700 dark:text-slate-300">Description</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{property.description}</p>
                    </div>

                    {property.type === 'For Sale' && (
                      <div className="border-t dark:border-slate-700 pt-4">
                          <MortgageCalculator priceMinorUnits={property.priceMinorUnits} currencyCode={property.currencyCode} />
                      </div>
                    )}


                    {property.agentName && (
                        <div className="border-t dark:border-slate-700 pt-4">
                            <h3 className="font-semibold text-slate-700 dark:text-slate-300">Contact Agent</h3>
                            <div className="mt-2 flex items-center justify-between">
                                <p className="text-slate-800 dark:text-slate-200">{property.agentName}</p>
                                <div className="flex items-center gap-3">
                                    {property.agentPhone && (
                                        <>
                                            <div className="relative group">
                                                <a href={`tel:${property.agentPhone.replace(/\D/g, '')}`} className="p-2 block rounded-full hover:bg-sky-100 dark:hover:bg-sky-900/50 text-sky-600 dark:text-sky-400" aria-label="Call Agent">
                                                    <PhoneIcon className="h-6 w-6" />
                                                </a>
                                                <Tooltip text="Call Agent" position="bottom" />
                                            </div>
                                            <div className="relative group">
                                                <a href={`https://wa.me/${property.agentPhone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-2 block rounded-full hover:bg-green-100 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400" aria-label="Contact on WhatsApp">
                                                    <WhatsappIcon className="h-6 w-6" />
                                                </a>
                                                <Tooltip text="Contact on WhatsApp" position="bottom" />
                                            </div>
                                        </>
                                    )}
                                    {property.agentEmail && (
                                        <div className="relative group">
                                            <a href={`mailto:${property.agentEmail}`} className="p-2 block rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400" aria-label="Send Email">
                                                <EmailIcon className="h-6 w-6" />
                                            </a>
                                            <Tooltip text="Send Email" position="bottom" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailModal;