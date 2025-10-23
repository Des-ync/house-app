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
import Map from './components/Map';
import { Spinner, MapIcon, ListIcon } from './components/icons';

import { findProperties } from './services/geminiService';
import type { Property, User } from './types';

const PropertyDetailModal = React.lazy(() => import('./components/PropertyDetailModal'));
const ComparisonView = React.lazy(() => import('./components/ComparisonView'));
const LoginPromptModal = React.lazy(() => import('./components/LoginPromptModal'));
const SavedPropertiesModal = React.lazy(() => import('./components/SavedPropertiesModal'));
const EditProfileModal = React.lazy(() => import('./components/EditProfileModal'));
const ChangePasswordModal = React.lazy(() => import('./components/ChangePasswordModal'));
const DeleteAccountModal = React.lazy(() => import('./components/DeleteAccountModal'));


type SortConfig = {
  key: 'price' | 'beds' | 'sqft';
  direction: 'asc' | 'desc';
};

const initialFilters = {
  maxPrice: 1000000,
  beds: 0,
  baths: 0,
  type: 'Any' as 'Any' | 'For Sale' | 'For Rent',
  verified: false,
  neighborhoods: [] as string[],
};

const App: React.FC = () => {
  // Authentication State
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        try {
            return JSON.parse(savedUser);
        } catch {
            localStorage.removeItem('user');
            return null;
        }
    }
    // Migration for old userEmail
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
        const newUser = { email: savedEmail };
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.removeItem('userEmail');
        return newUser;
    }
    return null;
  });
  const [isGuest, setIsGuest] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // UI State
  const [isDarkMode] = useState(true); // Dark mode is now permanently enabled
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMockData, setIsMockData] = useState(false);
  const [mapsApiLoaded, setMapsApiLoaded] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
  const [isEditProfileVisible, setIsEditProfileVisible] = useState(false);
  const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false);
  const [isDeleteAccountVisible, setIsDeleteAccountVisible] = useState(false);

  // Data State
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [searchLocation, setSearchLocation] = useState('Accra, Ghana');
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const savedHistory = localStorage.getItem('searchHistory');
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch {
      return [];
    }
  });
  
  // Filters State
  const [filters, setFilters] = useState(initialFilters);
  
  // Sorting State
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'price', direction: 'asc' });

  // Map State
  const [polygonPath, setPolygonPath] = useState<any[] | null>(null);
  const [clearDrawingTrigger, setClearDrawingTrigger] = useState(0);

  // Comparison State
  const [compareList, setCompareList] = useState<Property[]>([]);
  const [isComparisonViewVisible, setIsComparisonViewVisible] = useState(false);

  // Saved Properties State
  const [savedProperties, setSavedProperties] = useState<string[]>([]);
  const [isSavedPropertiesVisible, setIsSavedPropertiesVisible] = useState(false);

  // Effects
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    if (user) {
      try {
        const saved = localStorage.getItem(`saved_properties_${user.email}`);
        setSavedProperties(saved ? JSON.parse(saved) : []);
      } catch {
        setSavedProperties([]);
      }
    } else {
      setSavedProperties([]);
    }
  }, [user]);

  useEffect(() => {
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
        if(window.google?.maps) {
            setMapsApiLoaded(true);
        }
        return;
    }
    
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.API_KEY}&libraries=drawing,marker,places,geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setMapsApiLoaded(true);
    };
    script.onerror = () => {
      console.error("Google Maps script failed to load.");
      setError("Could not load Google Maps. Please check your API key and network connection.")
    };
    document.head.appendChild(script);
}, []);


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
    
    // Filter by baths
    if (filters.baths > 0) {
        properties = properties.filter(p => p.baths >= filters.baths);
    }
    
    // Filter by type
    if (filters.type !== 'Any') {
        properties = properties.filter(p => p.type === filters.type);
    }

    // Filter by verified status
    if (filters.verified) {
      properties = properties.filter(p => p.verified);
    }
    
    // Filter by neighborhood
    if (filters.neighborhoods.length > 0) {
        properties = properties.filter(p => filters.neighborhoods.includes(p.neighborhood));
    }

    // Filter by drawn polygon on map
    if (polygonPath && polygonPath.length > 2 && window.google?.maps?.geometry?.poly?.containsLocation) {
        const polygon = new window.google.maps.Polygon({ paths: polygonPath });
        properties = properties.filter(p => {
            const point = new window.google.maps.LatLng(p.lat, p.lng);
            return window.google.maps.geometry.poly.containsLocation(point, polygon);
        });
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
  }, [allProperties, filters, sortConfig, polygonPath]);
  
  const uniqueNeighborhoods = useMemo(() => {
      const neighborhoods = new Set(allProperties.map(p => p.neighborhood));
      return Array.from(neighborhoods).sort();
  }, [allProperties]);

  const currencyCode = useMemo(() => {
      return allProperties.length > 0 ? allProperties[0].currencyCode : 'USD';
  }, [allProperties]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.maxPrice < initialFilters.maxPrice) count++;
    if (filters.beds > initialFilters.beds) count++;
    if (filters.baths > initialFilters.baths) count++;
    if (filters.type !== initialFilters.type) count++;
    if (filters.verified !== initialFilters.verified) count++;
    if (filters.neighborhoods.length > 0) count++;
    return count;
  }, [filters]);

  const savedPropertyObjects = useMemo(() => {
      return allProperties.filter(p => savedProperties.includes(p.id));
  }, [savedProperties, allProperties]);

  // Handlers
  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    setIsGuest(false);
  };
  
  const handleGuestLogin = () => {
    setIsGuest(true);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setIsGuest(false);
  };
  
  const handleGoToLogin = () => {
    setIsGuest(false);
    setShowLoginPrompt(false);
  };

  const handleSearch = (location: string) => {
    setSearchLocation(location);
    setPolygonPath(null);
    setClearDrawingTrigger(c => c + 1);
    // Update search history
    setSearchHistory(prevHistory => {
        const newHistory = [location, ...prevHistory.filter(item => item.toLowerCase() !== location.toLowerCase())].slice(0, 5);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
        return newHistory;
    });
  };

  const handleClearSearch = () => {
      handleSearch('Accra, Ghana');
  }

  const handleCardClick = (id: string) => {
    if (isGuest || !user) {
        setShowLoginPrompt(true);
    } else {
        setSelectedPropertyId(id);
    }
  };
  
  const handleMarkerHover = (id: string | null) => {
      setHoveredPropertyId(id);
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
      setFilters(prev => ({ ...prev, ...newFilters}));
  }
  
  const handleClearFilters = () => {
    setFilters(initialFilters);
  };

  const handleSortChange = (newSortConfig: Partial<SortConfig>) => {
      setSortConfig(prev => ({ ...prev, ...newSortConfig }));
  }
  
  const handlePolygonDrawn = (path: any[]) => {
      setPolygonPath(path);
  };

  const handleDrawingCleared = () => {
      setPolygonPath(null);
  };


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

  const handleToggleSave = (propertyId: string) => {
    if (!user) {
        setShowLoginPrompt(true);
        return;
    }
    const newSavedProperties = savedProperties.includes(propertyId)
        ? savedProperties.filter(id => id !== propertyId)
        : [...savedProperties, propertyId];
    
    setSavedProperties(newSavedProperties);
    try {
        localStorage.setItem(`saved_properties_${user.email}`, JSON.stringify(newSavedProperties));
    } catch (e) {
        console.error("Failed to save properties to local storage:", e);
    }
  };
  
  const handleSaveProfile = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const handleDeleteAccount = () => {
      if (user) {
          localStorage.removeItem(`saved_properties_${user.email}`);
      }
      handleLogout();
      setIsDeleteAccountVisible(false);
  };

  const selectedProperty = useMemo(() => {
    return allProperties.find(p => p.id === selectedPropertyId) || null;
  }, [selectedPropertyId, allProperties]);


  // Render logic
  if (!user && !isGuest) {
    return <LoginPage onLogin={handleLogin} onGuestLogin={handleGuestLogin} isDarkMode={isDarkMode} />;
  }

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-50">
      <Header 
        onSearch={handleSearch} 
        isLoading={isLoading}
        user={user}
        onLogout={handleLogout}
        onGoToLogin={handleGoToLogin}
        isDarkMode={isDarkMode}
        onClear={handleClearSearch}
        searchHistory={searchHistory}
        onShowSavedProperties={() => setIsSavedPropertiesVisible(true)}
        onShowEditProfile={() => setIsEditProfileVisible(true)}
        onShowChangePassword={() => setIsChangePasswordVisible(true)}
        onShowDeleteAccount={() => setIsDeleteAccountVisible(true)}
      />
      {isMockData && <DemoDataBanner />}
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-5 overflow-hidden">
        {/* List View Container */}
        <div className={`lg:col-span-3 h-full ${mobileView === 'map' ? 'hidden' : 'block'} lg:block`}>
            <div className="h-full overflow-y-auto p-2 sm:p-4">
                <div className="max-w-4xl mx-auto">
                    <Filters 
                        onFilterChange={handleFilterChange} 
                        currentFilters={filters}
                        neighborhoods={uniqueNeighborhoods}
                        currencyCode={currencyCode}
                        sortConfig={sortConfig}
                        onSortChange={handleSortChange}
                        onClearFilters={handleClearFilters}
                        activeFilterCount={activeFilterCount}
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
                        onClearFilters={handleClearFilters}
                        activeFilterCount={activeFilterCount}
                        savedProperties={savedProperties}
                        onToggleSave={handleToggleSave}
                    />
                </div>
            </div>
        </div>
        
        {/* Map View Container */}
        <div className={`lg:col-span-2 h-full p-0 lg:p-4 lg:pl-0 ${mobileView === 'list' ? 'hidden' : 'block'} lg:block`}>
            <div className="h-full w-full rounded-none lg:rounded-lg shadow-inner overflow-hidden bg-slate-200 dark:bg-slate-700">
                {mapsApiLoaded ? (
                  <Map 
                    properties={filteredProperties}
                    selectedPropertyId={hoveredPropertyId || selectedPropertyId}
                    onMarkerClick={handleCardClick}
                    onPolygonDrawn={handlePolygonDrawn}
                    onDrawingCleared={handleDrawingCleared}
                    clearDrawingTrigger={clearDrawingTrigger}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 dark:text-slate-400">
                    <Spinner />
                    <span className="ml-2">Loading Map...</span>
                  </div>
                )}
            </div>
        </div>
      </main>

      {/* FAB for mobile view toggle */}
      <div className="lg:hidden fixed bottom-24 right-4 z-20">
        <button
          onClick={() => setMobileView(prev => prev === 'list' ? 'map' : 'list')}
          className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-all"
          aria-label={mobileView === 'list' ? 'Switch to map view' : 'Switch to list view'}
        >
          {mobileView === 'list' ? <MapIcon className="h-6 w-6" /> : <ListIcon className="h-6 w-6" />}
        </button>
      </div>

      {/* Modals and Overlays */}
      <Suspense fallback={<div />}>
        {selectedProperty && <PropertyDetailModal property={selectedProperty} onClose={() => setSelectedPropertyId(null)} isSaved={savedProperties.includes(selectedProperty.id)} onToggleSave={handleToggleSave} />}
        {showLoginPrompt && <LoginPromptModal onClose={() => setShowLoginPrompt(false)} onLogin={handleGoToLogin} />}
        {isSavedPropertiesVisible && (
            <SavedPropertiesModal 
                properties={savedPropertyObjects}
                onClose={() => setIsSavedPropertiesVisible(false)}
                onCardClick={(id) => {
                    setIsSavedPropertiesVisible(false);
                    handleCardClick(id);
                }}
                onToggleCompare={handleToggleCompare}
                compareList={compareList}
                savedProperties={savedProperties}
                onToggleSave={handleToggleSave}
            />
        )}
        {isEditProfileVisible && user && (
            <EditProfileModal 
                user={user}
                onClose={() => setIsEditProfileVisible(false)}
                onSave={handleSaveProfile}
            />
        )}
        {isChangePasswordVisible && (
            <ChangePasswordModal onClose={() => setIsChangePasswordVisible(false)} />
        )}
        {isDeleteAccountVisible && (
            <DeleteAccountModal 
                onClose={() => setIsDeleteAccountVisible(false)}
                onConfirmDelete={handleDeleteAccount}
            />
        )}
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
