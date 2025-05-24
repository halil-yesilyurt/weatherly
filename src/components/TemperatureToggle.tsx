'use client';

import { TemperatureUnit } from '@/types/weather';

interface TemperatureToggleProps {
  unit: TemperatureUnit;
  onToggle: (unit: TemperatureUnit) => void;
}

export default function TemperatureToggle({ unit, onToggle }: TemperatureToggleProps) {
  return (
    <div className="flex items-center glass rounded-2xl p-1 bg-white/5">
      <button
        onClick={() => onToggle('celsius')}
        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
          unit === 'celsius'
            ? 'bg-white/20 text-white shadow-lg'
            : 'text-white/60 hover:text-white/80'
        }`}
      >
        °C
      </button>
      <button
        onClick={() => onToggle('fahrenheit')}
        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
          unit === 'fahrenheit'
            ? 'bg-white/20 text-white shadow-lg'
            : 'text-white/60 hover:text-white/80'
        }`}
      >
        °F
      </button>
    </div>
  );
} 