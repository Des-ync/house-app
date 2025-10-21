
import { useState, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: GeolocationPositionError | null;
}

export const useGeolocation = () => {
  const [location, setLocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({ ...prev, loading: false, error: new GeolocationPositionError() }));
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
      setLocation(prev => ({ ...prev, loading: false, error }));
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
  }, []);

  return location;
};
