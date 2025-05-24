'use client';

import { useState, useEffect } from 'react';
import { WeatherData, ForecastData, TemperatureUnit } from '@/types/weather';
import { weatherService } from '@/services/weatherService';
import SearchBar from '@/components/SearchBar';
import WeatherCard from '@/components/WeatherCard';
import HourlyForecast from '@/components/HourlyForecast';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>('celsius');

  const fetchWeatherByLocation = async () => {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      // Fallback to a default city if geolocation fails
      await fetchWeatherByCity('London');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCity = async (city: string) => {
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
  };

  const handleSearch = (city: string) => {
    fetchWeatherByCity(city);
  };

  const handleRetry = () => {
    fetchWeatherByLocation();
  };

  useEffect(() => {
    fetchWeatherByLocation();
  }, []);

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ☁️ Weatherly
          </h1>
          <p className="text-white/60 text-lg mb-8">
            Beautiful weather, beautifully presented
          </p>
          <SearchBar onSearch={handleSearch} isLoading={loading} />
        </div>

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
                <HourlyForecast forecast={forecast} />
              </div>
              
              {/* Additional Weather Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass rounded-3xl p-6 text-white text-center">
                  <h3 className="text-lg font-medium mb-4 text-white/80">Next 7 Days</h3>
                  <div className="space-y-3">
                    {forecast.list
                      .filter((_, index) => index % 8 === 0) // Every 8th item (24 hours apart)
                      .slice(0, 7)
                      .map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm text-white/60">
                            {index === 0 ? 'Today' : 
                             new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">
                              {item.weather[0].icon.includes('d') ? '☀️' : '🌙'}
                            </span>
                            <span className="text-sm">
                              {Math.round(item.main.temp_max)}°/{Math.round(item.main.temp_min)}°
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="glass rounded-3xl p-6 text-white text-center">
                  <h3 className="text-lg font-medium mb-4 text-white/80">Other Cities</h3>
                  <div className="space-y-4">
                    {['New York', 'Tokyo', 'Paris'].map((city, index) => (
                      <div key={index} className="glass-dark rounded-2xl p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">{city}</p>
                            <p className="text-xs text-white/50">Partly Cloudy</p>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl">⛅</span>
                            <p className="text-lg font-medium">23°</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass rounded-3xl p-6 text-white text-center">
                  <h3 className="text-lg font-medium mb-4 text-white/80">Location Map</h3>
                  <div className="glass-dark rounded-2xl p-8 h-48 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-4xl mb-2 block">🗺️</span>
                      <p className="text-sm text-white/60">Interactive map</p>
                      <p className="text-xs text-white/40">Coming soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 text-white/40 text-sm">
          <p>Powered by OpenWeather API • Built with ❤️ using Next.js & Tailwind CSS</p>
        </footer>
      </div>
    </main>
  );
}
