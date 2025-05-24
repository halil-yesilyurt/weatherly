'use client';

import { TemperatureUnit } from '@/types/weather';

interface TemperatureToggleProps {
  unit: TemperatureUnit;
  onToggle: (unit: TemperatureUnit) => void;
  isLoading?: boolean;
}

export default function TemperatureToggle({ unit, onToggle, isLoading = false }: TemperatureToggleProps) {
  const handleToggle = () => {
    if (!isLoading) {
      const newUnit = unit === 'celsius' ? 'fahrenheit' : 'celsius';
      onToggle(newUnit);
    }
  };

  return (
    <div className="relative">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm z-10">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`relative flex items-center glass rounded-2xl p-1 bg-white/5 w-24 h-10 transition-all duration-300 cursor-pointer ${
          isLoading ? 'pointer-events-none opacity-50' : 'hover:bg-white/10'
        }`}
        aria-label={`Switch to ${unit === 'celsius' ? 'Fahrenheit' : 'Celsius'}`}
        role="switch"
        aria-checked={unit === 'fahrenheit'}
      >
        {/* Toggle Background Track */}
        <div className="absolute inset-1 rounded-xl bg-white/5"></div>
        
        {/* Moving Toggle Indicator */}
        <div
          className={`absolute top-1 bottom-1 w-10 bg-white/20 rounded-xl shadow-lg transition-all duration-300 transform ${
            unit === 'celsius' ? 'left-1' : 'left-[calc(100%-2.75rem)]'
          }`}
        ></div>
        
        {/* Temperature Labels */}
        <div className="relative z-10 flex w-full justify-between items-center px-2">
          <span
            className={`text-sm font-medium transition-all duration-300 ${
              unit === 'celsius' ? 'text-white' : 'text-white/60'
            }`}
          >
            °C
          </span>
          <span
            className={`text-sm font-medium transition-all duration-300 ${
              unit === 'fahrenheit' ? 'text-white' : 'text-white/60'
            }`}
          >
            °F
          </span>
        </div>
      </button>
    </div>
  );
} 