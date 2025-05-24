'use client';

import { WeatherData } from '@/types/weather';
import { useState } from 'react';

interface LocationMapProps {
  weather: WeatherData | null;
}

export default function LocationMap({ weather }: LocationMapProps) {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [showCoordinates, setShowCoordinates] = useState(false);

  const getLocationInfo = () => {
    if (!weather) return null;
    
    const { coord, name, sys } = weather;
    return {
      name,
      country: sys.country,
      lat: coord.lat.toFixed(4),
      lon: coord.lon.toFixed(4)
    };
  };

  const locationInfo = getLocationInfo();

  // Generate OpenStreetMap embed URL
  const getMapUrl = () => {
    if (!locationInfo) return '';
    
    const lat = parseFloat(locationInfo.lat);
    const lon = parseFloat(locationInfo.lon);
    
    // Using OpenStreetMap embed (no API key required)
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.1},${lat-0.1},${lon+0.1},${lat+0.1}&layer=mapnik&marker=${lat},${lon}`;
  };

  const copyCoordinates = () => {
    if (locationInfo) {
      navigator.clipboard?.writeText(`${locationInfo.lat}, ${locationInfo.lon}`);
      setShowCoordinates(true);
      setTimeout(() => setShowCoordinates(false), 2000);
    }
  };

  return (
    <div className="glass rounded-3xl p-6 text-white text-center h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white/80">Location Map</h3>
      </div>
      
      <div className="space-y-4 h-full flex flex-col">
        {/* Interactive Map */}
        {locationInfo ? (
          <div className="relative glass-dark rounded-2xl overflow-hidden flex-1 min-h-[250px] max-h-[300px]">
            {!isMapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-xs text-white/60">Loading map...</p>
                </div>
              </div>
            )}
            
            <iframe
              src={getMapUrl()}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '250px', maxHeight: '300px' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setIsMapLoaded(true)}
              className="rounded-2xl"
              title={`Map of ${locationInfo.name}`}
            ></iframe>
            
            {/* Map overlay with location info - positioned to not cover controls */}
            <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-lg p-2 max-w-[180px]">
              <p className="text-xs text-white font-medium truncate">{locationInfo.name}, {locationInfo.country}</p>
              <p className="text-xs text-white/70 mt-0.5">{locationInfo.lat}°, {locationInfo.lon}°</p>
            </div>
          </div>
        ) : (
          /* Placeholder when no location */
          <div className="glass-dark rounded-2xl p-8 flex-1 min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Animated Background Grid */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-10 grid-rows-8 h-full w-full">
                {Array.from({ length: 80 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="border border-white/20"
                    style={{
                      animationDelay: `${i * 0.05}s`,
                      animation: 'pulse 3s ease-in-out infinite'
                    }}
                  ></div>
                ))}
              </div>
            </div>
            
            {/* Placeholder Content */}
            <div className="relative z-10 text-center">
              <div className="text-6xl mb-4 animate-bounce">📍</div>
              <p className="text-lg text-white/70 mb-3">No Location Selected</p>
              <p className="text-sm text-white/50">Search for a city to see the interactive map</p>
            </div>
            
            {/* Animated Radar Effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border-2 border-white/20 rounded-full animate-ping"></div>
              <div className="absolute w-20 h-20 border-2 border-white/30 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
              <div className="absolute w-12 h-12 border-2 border-white/40 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
            </div>
          </div>
        )}

        {/* Location Details - Compact for better space usage */}
        {locationInfo && (
          <div className="space-y-3 flex-shrink-0">
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-dark rounded-xl p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-lg">🌍</span>
                  <span className="text-xs text-white/60">Coordinates</span>
                </div>
                <p className="text-xs text-white/80 font-mono">
                  {locationInfo.lat}°, {locationInfo.lon}°
                </p>
              </div>

              <div className="glass-dark rounded-xl p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-lg">🏙️</span>
                  <span className="text-xs text-white/60">Country</span>
                </div>
                <p className="text-xs text-white/80 font-medium">
                  {locationInfo.country}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-2">
              <button 
                onClick={() => {
                  const googleMapsUrl = `https://www.google.com/maps/@${locationInfo.lat},${locationInfo.lon},15z`;
                  window.open(googleMapsUrl, '_blank');
                }}
                className="flex-1 py-2 px-3 glass-dark rounded-xl text-xs text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>📍</span>
                <span>Google Maps</span>
              </button>
              <button 
                onClick={copyCoordinates}
                className={`flex-1 py-2 px-3 glass-dark rounded-xl text-xs transition-all duration-200 flex items-center justify-center space-x-2 ${
                  showCoordinates 
                    ? 'text-green-400 bg-green-500/20' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{showCoordinates ? '✓' : '📋'}</span>
                <span>{showCoordinates ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 