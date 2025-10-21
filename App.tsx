// Minimal type definitions for Google Maps API to satisfy TypeScript strict mode
// This is a workaround for environments where @types/google.maps cannot be installed.
declare namespace google.maps {
    class LatLng { constructor(lat: number, lng: number); }
    class Polygon { constructor(opts?: { paths: LatLng[] }); }
    namespace geometry.poly {
        function containsLocation(latLng: LatLng, polygon: Polygon): boolean;
    }
}
// End of type definitions

// Fix: Add `google` to the window object to resolve TypeScript errors.
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
import type { Property, FiltersState } from './types';
import { useGeolocation } from './hooks/useGeolocation';

const Map = React.lazy(() => import('./components/Map'));
const PropertyDetailModal = React.lazy(() => import('./components/PropertyDetailModal'));
const ComparisonView = React.lazy(() => import('./components/ComparisonView'));

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
  const [filters, setFilters] = useState<FiltersState>({
    maxPrice: 1000000,
    beds: 0,
    verified: false,
    neighborhoods: [],
  });
  const [polygonPath, setPolygonPath] = useState<google.maps.LatLng[] | null>(null);
  const [clearDrawingTrigger, setClearDrawingTrigger] = useState(0);


  // Comparison State
  const [compareList, setCompareList] = useState<Property[]>([]);
  const [isComparisonViewVisible, setIsComparisonViewVisible] = useState(false);

  // Geolocation
  const geolocation = useGeolocation();
  const userLocation = useMemo(() => {
    if (geolocation.latitude !== null && geolocation.longitude !== null) {
      return { lat: geolocation.latitude, lng: geolocation.longitude };
    }
    return null;
  }, [geolocation.latitude, geolocation.longitude]);

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

  // Filtering Logic
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

    // Filter by polygon drawing
    if (polygonPath && window.google?.maps?.geometry?.poly) {
        const polygon = new window.google.maps.Polygon({ paths: polygonPath });
        properties = properties.filter(p => 
            window.google.maps.geometry.poly.containsLocation(
                new window.google.maps.LatLng(p.lat, p.lng),
                polygon
            )
        );
    }

    return properties;
  }, [allProperties, filters, polygonPath]);
  
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
  
  const handleSearch = useCallback((location: string) => {
    setSearchLocation(location);
    setPolygonPath(null); // Clear polygon on new search
    setClearDrawingTrigger(c => c + 1); // Trigger map to clear drawing
  }, []);

  const handleClearSearch = useCallback(() => {
      handleSearch('Accra, Ghana');
  }, [handleSearch]);

  const handleCardClick = (id: string) => {
    setSelectedPropertyId(id);
  };
  
  const handleMarkerHover = (id: string | null) => {
      setHoveredPropertyId(id);
  };

  const handleFilterChange = (newFilters: FiltersState) => {
      setFilters(newFilters);
  };

  const handlePolygonDrawn = (path: google.maps.LatLng[]) => {
      setPolygonPath(path);
  }
  
  const handleDrawingCleared = () => {
      setPolygonPath(null);
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
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 overflow-hidden">
        {/* Left Panel */}
        <div className="lg:col-span-1 xl:col-span-1 flex flex-col gap-4 overflow-y-auto">
            <Filters 
                onFilterChange={handleFilterChange} 
                currentFilters={filters}
                neighborhoods={uniqueNeighborhoods}
                currencyCode={currencyCode}
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

        {/* Right Panel (Map) */}
        <div className="lg:col-span-2 xl:col-span-3 h-full min-h-[400px] lg:min-h-0">
          <Suspense fallback={<div className="w-full h-full bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse flex items-center justify-center">Loading Map...</div>}>
            <Map
                properties={filteredProperties}
                selectedPropertyId={hoveredPropertyId || selectedPropertyId}
                onMarkerClick={handleCardClick}
                onPolygonDrawn={handlePolygonDrawn}
                onDrawingCleared={handleDrawingCleared}
                clearDrawingTrigger={clearDrawingTrigger}
                userLocation={userLocation}
            />
          </Suspense>
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
