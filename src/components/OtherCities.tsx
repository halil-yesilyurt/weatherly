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

// Prioritized cities with proper country specification
const allPopularCities = [
  // Major European cities
  { name: 'London', country: 'GB' },
  { name: 'Paris', country: 'FR' },
  { name: 'Berlin', country: 'DE' },
  { name: 'Madrid', country: 'ES' },
  { name: 'Rome', country: 'IT' },
  { name: 'Amsterdam', country: 'NL' },
  { name: 'Stockholm', country: 'SE' },
  { name: 'Oslo', country: 'NO' },
  { name: 'Copenhagen', country: 'DK' },
  { name: 'Vienna', country: 'AT' },
  { name: 'Prague', country: 'CZ' },
  { name: 'Budapest', country: 'HU' },
  { name: 'Barcelona', country: 'ES' },
  { name: 'Munich', country: 'DE' },
  { name: 'Milan', country: 'IT' },
  
  // North American cities
  { name: 'New York', country: 'US' },
  { name: 'Los Angeles', country: 'US' },
  { name: 'Chicago', country: 'US' },
  { name: 'Miami', country: 'US' },
  { name: 'Las Vegas', country: 'US' },
  { name: 'San Francisco', country: 'US' },
  { name: 'Seattle', country: 'US' },
  { name: 'Toronto', country: 'CA' },
  { name: 'Vancouver', country: 'CA' },
  { name: 'Mexico City', country: 'MX' },
  
  // Asian cities
  { name: 'Tokyo', country: 'JP' },
  { name: 'Seoul', country: 'KR' },
  { name: 'Beijing', country: 'CN' },
  { name: 'Shanghai', country: 'CN' },
  { name: 'Hong Kong', country: 'HK' },
  { name: 'Singapore', country: 'SG' },
  { name: 'Bangkok', country: 'TH' },
  { name: 'Mumbai', country: 'IN' },
  { name: 'Delhi', country: 'IN' },
  { name: 'Manila', country: 'PH' },
  
  // Other continents
  { name: 'Sydney', country: 'AU' },
  { name: 'Melbourne', country: 'AU' },
  { name: 'Dubai', country: 'AE' },
  { name: 'Cairo', country: 'EG' },
  { name: 'Cape Town', country: 'ZA' },
  { name: 'São Paulo', country: 'BR' },
  { name: 'Buenos Aires', country: 'AR' },
  { name: 'Santiago', country: 'CL' },
  { name: 'Istanbul', country: 'TR' }
];

// Function to get random cities
const getRandomCities = (count: number = 3) => {
  const shuffled = [...allPopularCities].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export default function OtherCities({ onCityClick, unit }: OtherCitiesProps) {
  const [citiesWeather, setCitiesWeather] = useState<CityWeather[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const fetchCitiesWeather = async (selectedCities: typeof allPopularCities) => {
    // Initialize cities with loading state first to maintain height
    const initialCities: CityWeather[] = selectedCities.map(city => ({
      name: city.name,
      weather: null,
      loading: true
    }));
    setCitiesWeather(initialCities);

    // Fetch weather for each city with country specification
    const updatedCities = await Promise.all(
      selectedCities.map(async (city) => {
        try {
          const searchQuery = `${city.name},${city.country}`;
          const weather = await weatherService.getCurrentWeatherByCity(searchQuery);
          return { name: city.name, weather, loading: false };
        } catch (error) {
          console.error(`Failed to fetch weather for ${city.name}:`, error);
          return { name: city.name, weather: null, loading: false };
        }
      })
    );
    setCitiesWeather(updatedCities);
  };

  // Fetch cities on component mount and when refresh key changes
  useEffect(() => {
    const selectedCities = getRandomCities(3);
    fetchCitiesWeather(selectedCities);
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const selectedCities = getRandomCities(3);
    await fetchCitiesWeather(selectedCities);
    setIsRefreshing(false);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="glass rounded-3xl p-6 text-white text-center">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white/80">Popular Cities</h3>
      </div>
      
      {/* Fixed height container to prevent collapse */}
      <div className="min-h-[280px] flex flex-col">
        <div className="space-y-4 flex-1">
          {citiesWeather.map((cityWeather) => (
            <div 
              key={`${cityWeather.name}-${refreshKey}`} 
              className="glass-dark rounded-2xl p-4 cursor-pointer hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02] group h-[90px] flex items-center relative overflow-hidden"
              onClick={() => handleCityClick(cityWeather.name)}
            >
              <div className="flex justify-between items-center w-full relative z-10 group-hover:opacity-30">
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

              {/* Additional info on hover - positioned at bottom without covering main content */}
              {cityWeather.weather && (
                <div className="absolute left-4 right-4 bottom-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1 z-20">
                  <div className="flex justify-between text-xs text-white/80">
                    <span>Feels {convertTemperature(cityWeather.weather.main.feels_like)}{getTemperatureSymbol()}</span>
                    <span>💧 {cityWeather.weather.main.humidity}%</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Modern refresh button */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="w-full mt-4 py-3 px-4 glass-dark rounded-2xl text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-3 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className={`transition-transform duration-300 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'}`}>
            🔄
          </div>
          <span className="font-medium">
            {isRefreshing ? 'Loading new cities...' : 'Discover different cities'}
          </span>
        </button>
      </div>
    </div>
  );
} 