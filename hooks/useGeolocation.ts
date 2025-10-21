
import { useState, useEffect } from 'react';

interface GeolocationError {
  code: number;
  message: string;
}

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: GeolocationError | null;
}

export const useGeolocation = () => {
  const [location, setLocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: {
          code: 0,
          message: 'Geolocation is not supported by this browser.',
        },
      }));
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        loading: false,
        error: null,
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: {
          code: error.code,
          message: error.message,
        },
      }));
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
  }, []);

  return location;
};
