// Minimal type definitions for Google Maps API to satisfy TypeScript strict mode
// This is a workaround for environments where @types/google.maps cannot be installed.
declare namespace google.maps {
    class LatLng { constructor(lat: number, lng: number); }
    class LatLngBounds { constructor(); extend(latLng: LatLng | {lat: number, lng: number}): void; }
    class Map { constructor(mapDiv: HTMLElement, opts?: any); panTo(latLng: LatLng | {lat: number, lng: number}): void; setZoom(zoom: number): void; fitBounds(bounds: LatLngBounds, padding: any): void; }
    class Polygon { constructor(opts?: any); getPath(): { getArray: () => LatLng[] }; setMap(map: Map | null): void; }
    namespace event {
        function addListener(instance: any, eventName: string, handler: (...args: any[]) => void): void;
    }
    namespace drawing {
        class DrawingManager { constructor(opts?: any); getDrawingMode(): string | null; setMap(map: Map | null): void; setDrawingMode(mode: string | null): void; }
        const OverlayType: { POLYGON: string };
    }
    namespace marker {
        class AdvancedMarkerElement extends HTMLElement { constructor(opts?: any); addListener(eventName: string, handler: () => void): void; position: LatLng | {lat: number, lng: number}; map: Map | null; title: string; content: HTMLElement; zIndex: number; }
    }
}
// End of type definitions

// Fix: Add `google` to the window object to resolve TypeScript errors.
declare global {
  interface Window {
    google: any;
  }
}

import React, { useEffect, useRef } from 'react';
import type { Property } from '../types';
import { DrawIcon } from './icons';
import Tooltip from './Tooltip';

interface MapProps {
  properties: Property[];
  selectedPropertyId: string | null;
  onMarkerClick: (id: string) => void;
  onPolygonDrawn: (path: google.maps.LatLng[]) => void;
  onDrawingCleared: () => void;
  clearDrawingTrigger: number;
}

const Map: React.FC<MapProps> = ({ properties, selectedPropertyId, onMarkerClick, onPolygonDrawn, onDrawingCleared, clearDrawingTrigger }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<{ [key: string]: google.maps.marker.AdvancedMarkerElement }>({});
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null);
  const drawnPolygonRef = useRef<google.maps.Polygon | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current || !window.google?.maps) return;
    
    const initialCenter = properties.length > 0
      ? { lat: properties[0].lat, lng: properties[0].lng }
      : { lat: 5.6037, lng: -0.1870 };

    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center: initialCenter,
      zoom: 12,
      disableDefaultUI: true,
      zoomControl: true,
      mapId: 'DOMUS_REAL_ESTATE_MAP', // Required for Advanced Markers
      styles: [
         { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
        { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
        { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },
        { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
        { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
        { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9c9c9' }] },
        { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
      ],
    });

    drawingManagerRef.current = new window.google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: false,
        polygonOptions: {
            fillColor: '#2563EB',
            fillOpacity: 0.2,
            strokeColor: '#2563EB',
            strokeWeight: 2,
            clickable: false,
            editable: false,
            zIndex: 1,
        },
    });

    window.google.maps.event.addListener(drawingManagerRef.current, 'polygoncomplete', (polygon: google.maps.Polygon) => {
        if (drawnPolygonRef.current) {
            drawnPolygonRef.current.setMap(null);
        }
        drawnPolygonRef.current = polygon;
        const path = polygon.getPath().getArray();
        onPolygonDrawn(path);
        if (drawingManagerRef.current) {
            drawingManagerRef.current.setDrawingMode(null);
        }
    });

  }, []);

  const createMarkerElement = (isSelected: boolean): HTMLElement => {
      const element = document.createElement('div');
      element.className = `w-4 h-4 rounded-full border-2 border-white shadow-md transition-transform transform ${isSelected ? 'scale-150 bg-blue-600 ring-2 ring-blue-400' : 'bg-blue-500'}`;
      element.style.zIndex = isSelected ? '10' : '1';
      return element;
  }

  // Update markers
  useEffect(() => {
    if (!mapInstance.current || !window.google?.maps?.marker) return;

    Object.values(markersRef.current).forEach(marker => marker.map = null);
    markersRef.current = {};

    properties.forEach(property => {
      const isSelected = property.id === selectedPropertyId;
      const marker = new window.google.maps.marker.AdvancedMarkerElement({
        position: { lat: property.lat, lng: property.lng },
        map: mapInstance.current,
        title: property.address,
        content: createMarkerElement(isSelected),
        zIndex: isSelected ? 10 : 1,
      });

      marker.addListener('click', () => onMarkerClick(property.id));
      markersRef.current[property.id] = marker;
    });

  }, [properties, onMarkerClick, selectedPropertyId]);

  // Pan and zoom logic
  useEffect(() => {
    if (!mapInstance.current || !window.google) return;

    const selectedProp = properties.find(p => p.id === selectedPropertyId);

    if (selectedProp) {
        mapInstance.current.panTo({ lat: selectedProp.lat, lng: selectedProp.lng });
        mapInstance.current.setZoom(15);
    } else if (properties.length > 0 && !drawnPolygonRef.current) {
        const bounds = new window.google.maps.LatLngBounds();
        properties.forEach(p => bounds.extend({ lat: p.lat, lng: p.lng }));
        mapInstance.current.fitBounds(bounds, { top: 50, bottom: 50, left: 50, right: 50 });
    }
  }, [selectedPropertyId, properties]);

  const toggleDrawing = () => {
      if (!drawingManagerRef.current || !mapInstance.current || !window.google) return;
      if (drawingManagerRef.current.getDrawingMode() === window.google.maps.drawing.OverlayType.POLYGON) {
          drawingManagerRef.current.setDrawingMode(null);
      } else {
          drawingManagerRef.current.setMap(mapInstance.current);
          drawingManagerRef.current.setDrawingMode(window.google.maps.drawing.OverlayType.POLYGON);
      }
  };
  
  const clearDrawing = () => {
      if (drawnPolygonRef.current) {
          drawnPolygonRef.current.setMap(null);
          drawnPolygonRef.current = null;
      }
      onDrawingCleared();
  }

  useEffect(() => {
      if (clearDrawingTrigger > 0) {
          clearDrawing();
      }
  }, [clearDrawingTrigger]);

  return (
    <div className="w-full h-full rounded-lg shadow-inner relative">
        <div ref={mapRef} className="w-full h-full" />
        <div className="absolute top-2 right-2 flex flex-col gap-2">
            <div className="relative group">
                <button onClick={toggleDrawing} className="bg-white p-2 rounded-md shadow-md hover:bg-slate-100 transition-colors" aria-label="Draw area">
                    <DrawIcon />
                </button>
                <Tooltip text="Draw an area to search" position="left" />
            </div>
            <div className="relative group">
                <button onClick={clearDrawing} className="bg-white p-2 rounded-md shadow-md hover:bg-slate-100 transition-colors" aria-label="Clear drawing">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                </button>
                <Tooltip text="Clear drawn area" position="left" />
            </div>
        </div>
    </div>
  );
};

export default Map;
