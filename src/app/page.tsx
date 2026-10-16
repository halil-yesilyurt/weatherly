'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { WeatherData, ForecastData, TemperatureUnit } from '@/types/weather';
import { weatherService } from '@/services/weatherService';
import SearchBar from '@/components/SearchBar';
import WeatherCard from '@/components/WeatherCard';
import HourlyForecast from '@/components/HourlyForecast';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
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

  const requestRef = useRef(0);
  const fetchWeatherByCity = useCallback(async (city: string) => {
    const request = ++requestRef.current;
    try {
      setLoading(true);
      setError(null);
      const bundle = await weatherService.getWeatherBundleByCity(city);
      if (request !== requestRef.current) return;
      setWeather(bundle.weather);
      setForecast(bundle.forecast);
    } catch (err) {
      if (request === requestRef.current) setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      if (request === requestRef.current) setLoading(false);
    }
  }, []);

  const fetchWeatherByLocation = useCallback(async () => {
    const request = ++requestRef.current;
    setLoading(true);
    setError(null);
    try {
      const location = await weatherService.getCurrentPosition();
      const bundle = await weatherService.getWeatherBundleByCoords(location.latitude, location.longitude);
      if (request !== requestRef.current) return;
      setWeather(bundle.weather);
      setForecast(bundle.forecast);
      setSearchValue('Current location');
    } catch (err) {
      if (request === requestRef.current) setError(err instanceof Error ? err.message : 'Location unavailable');
    } finally {
      if (request === requestRef.current) setLoading(false);
    }
  }, []);

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
    if (searchValue.trim() && searchValue !== 'Current location') fetchWeatherByCity(searchValue);
    else fetchWeatherByCity('London');
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
    fetchWeatherByCity('London');
  }, [fetchWeatherByCity]);

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Link href="/" className="transition-transform hover:scale-105 block">
              <Image 
                src="/weatherly-logo.png" 
                alt="Weatherly Logo" 
                width={300}
                height={80}
                className="h-16 md:h-20 w-auto"
                priority
              />
            </Link>
          </div>
          <p className="font-caveat text-white/60 text-2xl mb-8">
            beautiful weather, at a glance
          </p>
          
          {/* Search, location and temperature preferences */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 w-full">
            <div className="w-full max-w-md">
              <SearchBar 
                onSearch={handleSearch} 
                isLoading={loading}
                value={searchValue}
                onChange={setSearchValue}
              />
            </div>
            <button type="button" onClick={fetchWeatherByLocation} className="px-4 h-10 rounded-xl border border-white/20 text-white/85 hover:bg-white/10 focus-visible:outline focus-visible:outline-2" aria-label="Get weather at my location">Use my location</button>
            <div className="flex-shrink-0">
              <TemperatureToggle 
                unit={unit} 
                onToggle={handleTemperatureToggle} 
                isLoading={isTemperatureChanging}
              />
            </div>
          </div>
        </div>


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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 7-Day Forecast */}
                <div className="glass rounded-3xl p-6 text-white text-center">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white/80">Next 7 Days</h3>
                  </div>
                  <div className="space-y-3">
                    {(forecast.daily ?? []).slice(1, 8).map((day) => {
                      const temp = (value: number) => unit === 'fahrenheit' ? Math.round(value * 9 / 5 + 32) : Math.round(value);
                      return (
                        <div key={day.date} className="flex justify-between items-center glass-dark rounded-xl p-3">
                          <span className="text-sm text-white/75">{new Date(day.date + 'T12:00:00Z').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' })}</span>
                          <span className="text-sm text-white/90">{day.weather.main} · {day.pop}% rain</span>
                          <span className="text-sm font-medium">{temp(day.max)}° / {temp(day.min)}°</span>
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
