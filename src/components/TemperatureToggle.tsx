'use client';

import { TemperatureUnit } from '@/types/weather';

interface TemperatureToggleProps {
  unit: TemperatureUnit;
  onToggle: (unit: TemperatureUnit) => void;
  isLoading?: boolean;
}

export default function TemperatureToggle({ unit, onToggle, isLoading = false }: TemperatureToggleProps) {
  return (
    <div className="flex items-center glass rounded-2xl p-1 bg-white/5 relative">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      )}
      
      <button
        onClick={() => onToggle('celsius')}
        disabled={isLoading}
        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
          unit === 'celsius'
            ? 'bg-white/20 text-white shadow-lg transform scale-105'
            : 'text-white/60 hover:text-white/80 hover:bg-white/5'
        } ${isLoading ? 'pointer-events-none' : ''}`}
      >
        °C
      </button>
      <button
        onClick={() => onToggle('fahrenheit')}
        disabled={isLoading}
        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
          unit === 'fahrenheit'
            ? 'bg-white/20 text-white shadow-lg transform scale-105'
            : 'text-white/60 hover:text-white/80 hover:bg-white/5'
        } ${isLoading ? 'pointer-events-none' : ''}`}
      >
        °F
      </button>
    </div>
  );
} 