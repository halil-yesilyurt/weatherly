'use client';

import { useState, useEffect } from 'react';
import { WeatherData, TemperatureUnit } from '@/types/weather';
import { weatherService } from '@/services/weatherService';

interface OtherCitiesProps {
  onCityClick: (city: string) => void;
  unit: TemperatureUnit;
}

interface CityWeather {
  name: string;
  weather: WeatherData | null;
  loading: boolean;
}

const allPopularCities = [
  'New York', 'Tokyo', 'Paris', 'Sydney', 'Dubai', 'London', 'Berlin', 'Madrid',
  'Rome', 'Amsterdam', 'Stockholm', 'Oslo', 'Copenhagen', 'Helsinki', 'Vienna',
  'Prague', 'Budapest', 'Warsaw', 'Zurich', 'Geneva', 'Miami', 'Las Vegas',
  'San Francisco', 'Seattle', 'Boston', 'Philadelphia', 'Atlanta', 'Dallas',
  'Houston', 'Phoenix', 'Denver', 'Barcelona', 'Munich', 'Milan', 'Naples',
  'Mumbai', 'Delhi', 'Bangkok', 'Manila', 'Singapore', 'Hong Kong', 'Seoul',
  'Istanbul', 'Tel Aviv', 'Cairo', 'Cape Town', 'São Paulo', 'Rio de Janeiro',
  'Buenos Aires', 'Santiago', 'Melbourne', 'Brisbane', 'Perth'
];

// Function to get random cities
const getRandomCities = (count: number = 3): string[] => {
  const shuffled = [...allPopularCities].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export default function OtherCities({ onCityClick, unit }: OtherCitiesProps) {
  const [citiesWeather, setCitiesWeather] = useState<CityWeather[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const convertTemperature = (temp: number): number => {
    if (unit === 'fahrenheit') {
      return Math.round((temp * 9/5) + 32);
    }
    return Math.round(temp);
  };

  const getTemperatureSymbol = (): string => {
    return unit === 'fahrenheit' ? '°F' : '°C';
  };

  const getWeatherIcon = (iconCode: string) => {
    const iconMap: { [key: string]: string } = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️',
    };
    return iconMap[iconCode] || '🌤️';
  };

  const fetchCitiesWeather = async () => {
    // Get random cities each time
    const randomCities = getRandomCities(3);
    
    // Initialize cities with loading state
    const initialCities: CityWeather[] = randomCities.map(city => ({
      name: city,
      weather: null,
      loading: true
    }));
    setCitiesWeather(initialCities);

    // Fetch weather for each city
    const updatedCities = await Promise.all(
      initialCities.map(async (cityWeather) => {
        try {
          const weather = await weatherService.getCurrentWeatherByCity(cityWeather.name);
          return { ...cityWeather, weather, loading: false };
        } catch (error) {
          console.error(`Failed to fetch weather for ${cityWeather.name}:`, error);
          return { ...cityWeather, loading: false };
        }
      })
    );
    setCitiesWeather(updatedCities);
  };

  // Fetch cities on component mount and when refresh key changes
  useEffect(() => {
    fetchCitiesWeather();
  }, [refreshKey]);

  // Update temperature display when unit changes
  useEffect(() => {
    // Force re-render when unit changes (temperature conversion happens in render)
  }, [unit]);

  const handleCityClick = (cityName: string) => {
    onCityClick(cityName);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="glass rounded-3xl p-6 text-white text-center">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white/80">Popular Cities</h3>
        <div className="text-xs text-white/50">Live weather</div>
      </div>
      <div className="space-y-4">
        {citiesWeather.map((cityWeather) => (
          <div 
            key={`${cityWeather.name}-${refreshKey}`} 
            className="glass-dark rounded-2xl p-4 cursor-pointer hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02] group"
            onClick={() => handleCityClick(cityWeather.name)}
          >
            <div className="flex justify-between items-center">
              <div className="text-left">
                <p className="text-sm font-medium group-hover:text-white transition-colors">
                  {cityWeather.name}
                </p>
                {cityWeather.loading ? (
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-xs text-white/50">Loading...</span>
                  </div>
                ) : cityWeather.weather ? (
                  <p className="text-xs text-white/60 capitalize">
                    {cityWeather.weather.weather[0].description}
                  </p>
                ) : (
                  <p className="text-xs text-white/50">No data</p>
                )}
              </div>
              <div className="text-right">
                {cityWeather.loading ? (
                  <div className="text-2xl mb-1">⏳</div>
                ) : cityWeather.weather ? (
                  <span className="text-2xl mb-1 block group-hover:scale-110 transition-transform">
                    {getWeatherIcon(cityWeather.weather.weather[0].icon)}
                  </span>
                ) : (
                  <span className="text-2xl mb-1 block">❓</span>
                )}
                <p className="text-lg font-medium">
                  {cityWeather.loading 
                    ? '--°' 
                    : cityWeather.weather 
                      ? `${convertTemperature(cityWeather.weather.main.temp)}${getTemperatureSymbol()}`
                      : '--°'
                  }
                </p>
              </div>
            </div>

            {/* Additional info on hover */}
            {cityWeather.weather && (
              <div className="mt-3 pt-3 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex justify-between text-xs text-white/60">
                  <span>Feels like {convertTemperature(cityWeather.weather.main.feels_like)}{getTemperatureSymbol()}</span>
                  <span>💧 {cityWeather.weather.main.humidity}%</span>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {/* Refresh button */}
        <button
          onClick={handleRefresh}
          className="w-full mt-4 py-2 text-xs text-white/50 hover:text-white/70 transition-colors flex items-center justify-center space-x-2 hover:bg-white/5 rounded-xl"
        >
          <span>🔄</span>
          <span>Show different cities</span>
        </button>
      </div>
    </div>
  );
} 