import React, { useEffect, useRef, useState } from 'react';

interface SearchAutocompleteProps {
  onSearch: (location: string) => void;
  isLoading: boolean;
  onClear: () => void;
}

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({ onSearch, isLoading, onClear }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<any>(null); // To hold the element instance
  const DEFAULT_LOCATION = 'Accra, Ghana';
  const [currentValue, setCurrentValue] = useState(DEFAULT_LOCATION);
  const onSearchRef = useRef(onSearch);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    let intervalId: number | null = null;
    let styleElement: HTMLStyleElement | null = null;
    let autocompleteInstance: any = null;

    const handlePlaceChange = (event: any) => {
      const place = event.detail?.place;
      if (place?.formattedAddress) {
        setCurrentValue(place.formattedAddress);
        onSearchRef.current(place.formattedAddress);
      }
    };

    const initAutocomplete = () => {
      if (!containerRef.current || !(window as any).google?.maps?.places?.PlaceAutocompleteElement) {
        return;
      }

      if (!autocompleteRef.current) {
        const autocomplete = new (window as any).google.maps.places.PlaceAutocompleteElement({
           types: ['(cities)'],
        });

        if (!document.getElementById('search-autocomplete-style')) {
          styleElement = document.createElement('style');
          styleElement.id = 'search-autocomplete-style';
          styleElement.textContent = `
            gmp-place-autocomplete input {
              padding: 0.5rem 1rem;
              border: 1px solid #cbd5e1;
              border-radius: 0.375rem;
              width: 12rem; /* 192px */
              background-color: white;
              color: #0f172a;
              transition: all 150ms ease-in-out;
            }
            .dark gmp-place-autocomplete input {
              border-color: #475569;
              background-color: #334155;
              color: #f1f5f9;
            }
            gmp-place-autocomplete input:focus {
              outline: 2px solid transparent;
              outline-offset: 2px;
              border-color: #3b82f6;
              --tw-ring-color: #3b82f6;
              --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
              --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
              box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
            }
          `;
          document.head.appendChild(styleElement);
        }

        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(autocomplete);
        autocompleteRef.current = autocomplete;
        autocompleteRef.current.value = DEFAULT_LOCATION;
        autocomplete.addEventListener('gmp-placechange', handlePlaceChange);
        autocompleteInstance = autocomplete;
      } else {
        autocompleteInstance = autocompleteRef.current;
      }
    };

    if ((window as any).google?.maps?.places?.PlaceAutocompleteElement) {
      initAutocomplete();
    } else {
      intervalId = window.setInterval(() => {
        if ((window as any).google?.maps?.places?.PlaceAutocompleteElement) {
          initAutocomplete();
          if (intervalId !== null) {
            window.clearInterval(intervalId);
            intervalId = null;
          }
        }
      }, 100);
    }

    return () => {
      if (intervalId !== null) {
        window.clearInterval(intervalId);
      }

      const instance = autocompleteInstance || autocompleteRef.current;
      if (instance?.removeEventListener) {
        instance.removeEventListener('gmp-placechange', handlePlaceChange);
      }

      if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }

      autocompleteRef.current = null;
    };
  }, []);
  
  const handleClear = () => {
      setCurrentValue(DEFAULT_LOCATION);
      if (autocompleteRef.current) {
          autocompleteRef.current.value = DEFAULT_LOCATION;
      }
      onClear();
  };

  return (
    <div className="flex items-center gap-2">
      <div ref={containerRef} className={isLoading ? 'opacity-50' : ''}>
         {/* The PlaceAutocompleteElement will be rendered here */}
      </div>
      <button
        type="button"
        onClick={handleClear}
        disabled={isLoading}
        className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
      >
        Clear
      </button>
    </div>
  );
};

export default SearchAutocomplete;