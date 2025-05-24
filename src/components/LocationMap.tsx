'use client';

import { WeatherData } from '@/types/weather';

interface LocationMapProps {
  weather: WeatherData | null;
}

export default function LocationMap({ weather }: LocationMapProps) {
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

  return (
    <div className="glass rounded-3xl p-6 text-white text-center">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white/80">Location Info</h3>
        <div className="text-xs text-white/50">Coordinates</div>
      </div>
      
      <div className="space-y-4">
        {/* Map Placeholder with Better Design */}
        <div className="glass-dark rounded-2xl p-6 h-48 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Animated Background Grid */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
              {Array.from({ length: 48 }).map((_, i) => (
                <div 
                  key={i} 
                  className="border border-white/20"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    animation: 'pulse 3s ease-in-out infinite'
                  }}
                ></div>
              ))}
            </div>
          </div>
          
          {/* Map Content */}
          <div className="relative z-10 text-center">
            <div className="text-4xl mb-3 animate-bounce">📍</div>
            <p className="text-sm text-white/60 mb-2">Interactive Map</p>
            <p className="text-xs text-white/40">Coming Soon</p>
            
            {locationInfo && (
              <div className="mt-4 p-3 bg-black/20 rounded-lg">
                <p className="text-xs text-white/70 mb-1">Current Location</p>
                <p className="text-sm font-medium">{locationInfo.name}, {locationInfo.country}</p>
              </div>
            )}
          </div>
          
          {/* Animated Radar Effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 border-2 border-white/20 rounded-full animate-ping"></div>
            <div className="absolute w-16 h-16 border-2 border-white/30 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
            <div className="absolute w-8 h-8 border-2 border-white/40 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>

        {/* Location Details */}
        {locationInfo && (
          <div className="space-y-3">
            <div className="glass-dark rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🌍</span>
                  <span className="text-sm text-white/60">Coordinates</span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/80">
                    {locationInfo.lat}°, {locationInfo.lon}°
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-dark rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🏙️</span>
                  <span className="text-sm text-white/60">Region</span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/80">
                    {locationInfo.country}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-2 mt-4">
              <button 
                onClick={() => {
                  const googleMapsUrl = `https://www.google.com/maps/@${locationInfo.lat},${locationInfo.lon},15z`;
                  window.open(googleMapsUrl, '_blank');
                }}
                className="flex-1 py-2 px-3 glass-dark rounded-xl text-xs text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                📍 Google Maps
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard?.writeText(`${locationInfo.lat}, ${locationInfo.lon}`);
                }}
                className="flex-1 py-2 px-3 glass-dark rounded-xl text-xs text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                📋 Copy Coords
              </button>
            </div>
          </div>
        )}

        {/* No location info */}
        {!locationInfo && (
          <div className="glass-dark rounded-2xl p-4 text-center">
            <span className="text-lg mb-2 block">🔍</span>
            <p className="text-xs text-white/60">
              Search for a city to see location details
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 