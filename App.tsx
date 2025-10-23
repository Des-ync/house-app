// Fix: Add `google` to the window object to resolve TypeScript errors.
// This is no longer strictly necessary but kept for any potential minor type overlaps.
declare global {
  interface Window {
    google: any;
  }
}

import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import Header from './components/Header';
import PropertyList from './components/PropertyList';
import Filters from './components/Filters';
import LoginPage from './components/LoginPage';
import ComparisonTray from './components/ComparisonTray';
import DemoDataBanner from './components/DemoDataBanner';

import { findProperties } from './services/geminiService';
import type { Property } from './types';

const PropertyDetailModal = React.lazy(() => import('./components/PropertyDetailModal'));
const ComparisonView = React.lazy(() => import('./components/ComparisonView'));

type SortConfig = {
  key: 'price' | 'beds' | 'sqft';
  direction: 'asc' | 'desc';
};


const App: React.FC = () => {
  // Authentication State
  const [userEmail, setUserEmail] = useState<string | null>(localStorage.getItem('userEmail'));

  // UI State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMockData, setIsMockData] = useState(false);

  // Data State
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [searchLocation, setSearchLocation] = useState('Accra, Ghana');
  
  // Filters State
  const [filters, setFilters] = useState({
    maxPrice: 1000000,
    beds: 0,
    verified: false,
    neighborhoods: [] as string[],
  });
  
  // Sorting State
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'price', direction: 'asc' });


  // Comparison State
  const [compareList, setCompareList] = useState<Property[]>([]);
  const [isComparisonViewVisible, setIsComparisonViewVisible] = useState(false);

  // Effects
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const fetchAndSetProperties = useCallback(async (location: string) => {
    setIsLoading(true);
    setError(null);
    setSelectedPropertyId(null);
    setAllProperties([]);
    try {
      const { properties, isMockData } = await findProperties(location);
      setAllProperties(properties);
      setIsMockData(isMockData);
    } catch (err) {
      setError('Failed to fetch properties. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndSetProperties(searchLocation);
  }, [searchLocation, fetchAndSetProperties]);

  // Filtering and Sorting Logic
  const filteredProperties = useMemo(() => {
    let properties = allProperties;

    // Filter by price
    properties = properties.filter(p => p.priceMinorUnits <= filters.maxPrice * 100);

    // Filter by beds
    if (filters.beds > 0) {
      properties = properties.filter(p => p.beds >= filters.beds);
    }

    // Filter by verified status
    if (filters.verified) {
      properties = properties.filter(p => p.verified);
    }
    
    // Filter by neighborhood
    if (filters.neighborhoods.length > 0) {
        properties = properties.filter(p => filters.neighborhoods.includes(p.neighborhood));
    }
    
    // Sort the filtered properties
    const sortableProperties = [...properties];
    sortableProperties.sort((a, b) => {
        const { key, direction } = sortConfig;
        const sortKey = key === 'price' ? 'priceMinorUnits' : key;
        
        const valA = a[sortKey as keyof Property] as number;
        const valB = b[sortKey as keyof Property] as number;

        if (valA < valB) {
            return direction === 'asc' ? -1 : 1;
        }
        if (valA > valB) {
            return direction === 'asc' ? 1 : -1;
        }
        return 0;
    });


    return sortableProperties;
  }, [allProperties, filters, sortConfig]);
  
  const uniqueNeighborhoods = useMemo(() => {
      const neighborhoods = new Set(allProperties.map(p => p.neighborhood));
      return Array.from(neighborhoods).sort();
  }, [allProperties]);

  const currencyCode = useMemo(() => {
      return allProperties.length > 0 ? allProperties[0].currencyCode : 'USD';
  }, [allProperties]);


  // Handlers
  const handleLogin = (email: string) => {
    setUserEmail(email);
    localStorage.setItem('userEmail', email);
  };

  const handleLogout = () => {
    setUserEmail(null);
    localStorage.removeItem('userEmail');
  };

  const handleToggleDarkMode = () => setIsDarkMode(prev => !prev);
  
  const handleSearch = (location: string) => {
    setSearchLocation(location);
  };

  const handleClearSearch = () => {
      handleSearch('Accra, Ghana');
  }

  const handleCardClick = (id: string) => {
    setSelectedPropertyId(id);
  };
  
  const handleMarkerHover = (id: string | null) => {
      setHoveredPropertyId(id);
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
      setFilters(prev => ({ ...prev, ...newFilters}));
  }

  const handleSortChange = (newSortConfig: Partial<SortConfig>) => {
      setSortConfig(prev => ({ ...prev, ...newSortConfig }));
  }

  const handleToggleCompare = (property: Property) => {
    setCompareList(prev => {
      const isInList = prev.find(p => p.id === property.id);
      if (isInList) {
        return prev.filter(p => p.id !== property.id);
      } else {
        if (prev.length < 3) {
          return [...prev, property];
        }
        return prev;
      }
    });
  };

  const handleClearCompare = () => setCompareList([]);

  const selectedProperty = useMemo(() => {
    return allProperties.find(p => p.id === selectedPropertyId) || null;
  }, [selectedPropertyId, allProperties]);


  // Render logic
  if (!userEmail) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className={`flex flex-col h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 transition-colors duration-300`}>
      <Header 
        onSearch={handleSearch} 
        isLoading={isLoading}
        userEmail={userEmail}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onClear={handleClearSearch}
      />
      {isMockData && <DemoDataBanner />}
      <main className="flex-grow p-4 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
            <Filters 
                onFilterChange={handleFilterChange} 
                currentFilters={filters}
                neighborhoods={uniqueNeighborhoods}
                currencyCode={currencyCode}
                sortConfig={sortConfig}
                onSortChange={handleSortChange}
            />
            <PropertyList 
                properties={filteredProperties}
                selectedPropertyId={hoveredPropertyId || selectedPropertyId}
                onCardClick={handleCardClick}
                onMarkerHover={handleMarkerHover}
                isLoading={isLoading}
                error={error}
                onToggleCompare={handleToggleCompare}
                compareList={compareList}
            />
        </div>
      </main>

      {/* Modals and Overlays */}
      <Suspense fallback={<div />}>
        {selectedProperty && <PropertyDetailModal property={selectedProperty} onClose={() => setSelectedPropertyId(null)} />}
      </Suspense>
      
      <ComparisonTray 
        properties={compareList}
        onRemove={(id) => setCompareList(prev => prev.filter(p => p.id !== id))}
        onCompare={() => setIsComparisonViewVisible(true)}
        onClear={handleClearCompare}
      />
      
      <Suspense fallback={<div />}>
        {isComparisonViewVisible && (
          <ComparisonView 
              properties={compareList}
              onClose={() => setIsComparisonViewVisible(false)}
              onRemove={(id) => setCompareList(prev => prev.filter(p => p.id !== id))}
          />
        )}
      </Suspense>
    </div>
  );
};

export default App;