'use client';

import { useState, useEffect, useCallback } from 'react';
import { WeatherData, ForecastData, TemperatureUnit } from '@/types/weather';
import { weatherService } from '@/services/weatherService';
import SearchBar from '@/components/SearchBar';
import WeatherCard from '@/components/WeatherCard';
import HourlyForecast from '@/components/HourlyForecast';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import DemoNotice from '@/components/DemoNotice';
import TemperatureToggle from '@/components/TemperatureToggle';
import OtherCities from '@/components/OtherCities';
import LocationMap from '@/components/LocationMap';

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>('celsius');
  const [searchValue, setSearchValue] = useState('');
  const [isTemperatureChanging, setIsTemperatureChanging] = useState(false);

  // Check if we're using demo data
  const isDemoMode = !process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || 
                     process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY === 'demo_key' ||
                     process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY === 'your_api_key_here';

  const fetchWeatherByCity = useCallback(async (city: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const [weatherData, forecastData] = await Promise.all([
        weatherService.getCurrentWeatherByCity(city),
        weatherService.getForecastByCity(city),
      ]);
      
      setWeather(weatherData);
      setForecast(forecastData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWeatherByLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const location = await weatherService.getCurrentPosition();
      const [weatherData, forecastData] = await Promise.all([
        weatherService.getCurrentWeatherByCoords(location.latitude, location.longitude),
        weatherService.getForecastByCoords(location.latitude, location.longitude),
      ]);
      
      setWeather(weatherData);
      setForecast(forecastData);
      // Only update search value after successful location detection
      setSearchValue(weatherData.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      // Fallback to a default city if geolocation fails, but keep search bar empty
      await fetchWeatherByCity('London');
      setSearchValue(''); // Keep search bar empty on geolocation failure
    } finally {
      setLoading(false);
    }
  }, [fetchWeatherByCity]);

  const handleSearch = (city: string) => {
    setSearchValue(city);
    fetchWeatherByCity(city);
  };

  const handleCityClick = (city: string) => {
    setSearchValue(city);
    fetchWeatherByCity(city);
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    fetchWeatherByLocation();
  };

  const handleTemperatureToggle = (newUnit: TemperatureUnit) => {
    setIsTemperatureChanging(true);
    setUnit(newUnit);
    
    // Add a small delay for visual feedback
    setTimeout(() => {
      setIsTemperatureChanging(false);
    }, 500);
  };

  useEffect(() => {
    fetchWeatherByLocation();
  }, [fetchWeatherByLocation]);

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ☁️ Weatherly
          </h1>
          <p className="font-caveat text-white/60 text-2xl mb-8">
            beautiful weather, at a glance
          </p>
          
          {/* Search and Temperature Toggle - Better centering for mobile */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 w-full">
            <div className="w-full max-w-md">
              <SearchBar 
                onSearch={handleSearch} 
                isLoading={loading}
                value={searchValue}
                onChange={setSearchValue}
              />
            </div>
            <div className="flex-shrink-0">
              <TemperatureToggle 
                unit={unit} 
                onToggle={handleTemperatureToggle} 
                isLoading={isTemperatureChanging}
              />
            </div>
          </div>
        </div>

        {/* Demo Notice */}
        {isDemoMode && <DemoNotice />}

        {/* Content */}
        <div className={`space-y-8 transition-all duration-500 ${isTemperatureChanging ? 'opacity-80 transform scale-[0.99]' : 'opacity-100 transform scale-100'}`}>
          {loading && <LoadingSpinner />}
          
          {error && !loading && (
            <ErrorMessage message={error} onRetry={handleRetry} />
          )}
          
          {weather && forecast && !loading && !error && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <WeatherCard weather={weather} unit={unit} />
                <HourlyForecast forecast={forecast} unit={unit} />
              </div>
              
              {/* Additional Weather Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 7-Day Forecast */}
                <div className="glass rounded-3xl p-6 text-white text-center">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white/80">Next 7 Days</h3>
                  </div>
                  <div className="space-y-3">
                    {(() => {
                      // Get unique days starting from tomorrow
                      const today = new Date();
                      const tomorrow = new Date(today);
                      tomorrow.setDate(today.getDate() + 1);
                      tomorrow.setHours(0, 0, 0, 0);
                      
                      const uniqueDays = [];
                      const processedDates = new Set();
                      
                      // Process forecast items and group by day
                      const dayGroups = new Map();
                      
                      for (const item of forecast.list) {
                        const itemDate = new Date(item.dt * 1000);
                        const dateKey = itemDate.toDateString();
                        
                        if (!dayGroups.has(dateKey)) {
                          dayGroups.set(dateKey, []);
                        }
                        dayGroups.get(dateKey).push(item);
                      }
                      
                      // Get tomorrow and the next 6 days (total 7 days)
                      const daysToShow = [];
                      for (let i = 0; i < 7; i++) {
                        const targetDate = new Date(tomorrow);
                        targetDate.setDate(tomorrow.getDate() + i);
                        const dateKey = targetDate.toDateString();
                        
                        if (dayGroups.has(dateKey)) {
                          // Use the first item of the day (or you could average temperatures)
                          const dayItems = dayGroups.get(dateKey);
                          // Find the item closest to noon for better representation
                          const noonItem = dayItems.reduce((closest: ForecastData['list'][0], current: ForecastData['list'][0]) => {
                            const currentHour = new Date(current.dt * 1000).getHours();
                            const closestHour = new Date(closest.dt * 1000).getHours();
                            return Math.abs(currentHour - 12) < Math.abs(closestHour - 12) ? current : closest;
                          });
                          
                          daysToShow.push({ item: noonItem, dayIndex: i });
                        }
                      }
                      
                      return daysToShow.map(({ item, dayIndex }, index) => {
                        const convertTemp = (temp: number) => {
                          if (unit === 'fahrenheit') {
                            return Math.round((temp * 9/5) + 32);
                          }
                          return Math.round(temp);
                        };
                        const tempSymbol = unit === 'fahrenheit' ? '°F' : '°C';
                        const itemDate = new Date(item.dt * 1000);
                        
                        const getDayLabel = (dayIndex: number) => {
                          if (dayIndex === 0) return 'Tomorrow';
                          return itemDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                        };
                        
                        return (
                          <div key={index} className="flex justify-between items-center glass-dark rounded-xl p-3 hover:bg-white/5 transition-colors">
                            <span className="text-sm text-white/70 font-medium min-w-[100px]">
                              {getDayLabel(dayIndex)}
                            </span>
                            <div className="flex items-center space-x-3">
                              <span className="text-lg">
                                {item.weather[0].icon.includes('d') ? '☀️' : '🌙'}
                              </span>
                              <span className="text-sm font-medium text-right min-w-[80px]">
                                {convertTemp(item.main.temp_max)}{tempSymbol}/{convertTemp(item.main.temp_min)}{tempSymbol}
                              </span>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Other Cities with Real Weather */}
                <OtherCities onCityClick={handleCityClick} unit={unit} />

                {/* Location Map */}
                <LocationMap weather={weather} />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 text-white/40 text-sm">
          <p>Powered by OpenWeather API • Built with ❤️ using Next.js & Tailwind CSS</p>
          <p className="text-xs mt-2 text-white/30">
            Real-time weather data • Auto-complete search • Temperature conversion
          </p>
        </footer>
      </div>
    </main>
  );
}
