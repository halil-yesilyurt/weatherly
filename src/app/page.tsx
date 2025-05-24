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
      setSearchValue(weatherData.name); // Update search value with detected city
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      // Fallback to a default city if geolocation fails
      await fetchWeatherByCity('London');
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
    setUnit(newUnit);
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
          
          {/* Search and Temperature Toggle */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <SearchBar 
              onSearch={handleSearch} 
              isLoading={loading}
              value={searchValue}
              onChange={setSearchValue}
            />
            <TemperatureToggle unit={unit} onToggle={handleTemperatureToggle} />
          </div>
        </div>

        {/* Demo Notice */}
        {isDemoMode && <DemoNotice />}

        {/* Content */}
        <div className="space-y-8">
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
                    <div className="text-xs text-white/50">Extended forecast</div>
                  </div>
                  <div className="space-y-3">
                    {forecast.list
                      .filter((_, index) => index % 8 === 0) // Every 8th item (24 hours apart)
                      .slice(0, 7)
                      .map((item, index) => {
                        const convertTemp = (temp: number) => {
                          if (unit === 'fahrenheit') {
                            return Math.round((temp * 9/5) + 32);
                          }
                          return Math.round(temp);
                        };
                        const tempSymbol = unit === 'fahrenheit' ? '°F' : '°C';
                        
                        return (
                          <div key={index} className="flex justify-between items-center glass-dark rounded-xl p-3 hover:bg-white/5 transition-colors">
                            <span className="text-sm text-white/70 font-medium">
                              {index === 0 ? 'Today' : 
                               new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                            </span>
                            <div className="flex items-center space-x-3">
                              <span className="text-lg">
                                {item.weather[0].icon.includes('d') ? '☀️' : '🌙'}
                              </span>
                              <span className="text-sm font-medium min-w-[60px] text-right">
                                {convertTemp(item.main.temp_max)}{tempSymbol}/{convertTemp(item.main.temp_min)}{tempSymbol}
                              </span>
                            </div>
                          </div>
                        );
                      })}
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
