import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Dynamically load the Google Maps script to correctly insert the API key
const GOOGLE_MAPS_API_KEY = process.env.API_KEY;

const loadGoogleMapsScript = () => {
  // Check if the script is already loaded or being loaded
  if ((window as any).google || document.querySelector('script[src*="maps.googleapis.com"]')) {
    return;
  }
  
  if (GOOGLE_MAPS_API_KEY) {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,drawing,marker,geometry`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  } else {
    console.error("Google Maps API Key is not set. The map will not function correctly.");
  }
};

loadGoogleMapsScript();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);