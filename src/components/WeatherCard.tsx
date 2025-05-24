'use client';

import { WeatherData } from '@/types/weather';
import { weatherService } from '@/services/weatherService';

interface WeatherCardProps {
  weather: WeatherData;
  unit: 'celsius' | 'fahrenheit';
}

export default function WeatherCard({ weather, unit }: WeatherCardProps) {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getWeatherIcon = (iconCode: string) => {
    // Map weather icons to emojis for better visual appeal
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

  return (
    <div className="glass rounded-3xl p-8 text-white max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium text-white/80">
            📍 {weather.name}, {weather.sys.country}
          </h2>
          <p className="text-sm text-white/60">
            {formatDate(weather.dt)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-white/60">°C</p>
          <p className="text-sm text-white/60">°F</p>
        </div>
      </div>

      {/* Main Temperature */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <span className="text-6xl mr-4">{getWeatherIcon(weather.weather[0].icon)}</span>
          <div>
            <div className="text-6xl font-light">
              {Math.round(weather.main.temp)}°
            </div>
            <p className="text-lg text-white/80 capitalize">
              {weather.weather[0].description}
            </p>
          </div>
        </div>
        <p className="text-sm text-white/60">
          L: {Math.round(weather.main.temp_min)}° H: {Math.round(weather.main.temp_max)}°
        </p>
      </div>

      {/* Weather Details */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="glass-dark rounded-2xl p-4">
          <div className="flex items-center mb-2">
            <span className="text-lg mr-2">💧</span>
            <span className="text-sm text-white/60">Humidity</span>
          </div>
          <p className="text-2xl font-medium">{weather.main.humidity}%</p>
          <p className="text-xs text-white/50">
            The dew point is {Math.round(weather.main.feels_like)}° right now.
          </p>
        </div>

        <div className="glass-dark rounded-2xl p-4">
          <div className="flex items-center mb-2">
            <span className="text-lg mr-2">👁️</span>
            <span className="text-sm text-white/60">Visibility</span>
          </div>
          <p className="text-2xl font-medium">{Math.round(weather.visibility / 1000)} km</p>
          <p className="text-xs text-white/50">
            Haze is significantly affecting visibility.
          </p>
        </div>

        <div className="glass-dark rounded-2xl p-4">
          <div className="flex items-center mb-2">
            <span className="text-lg mr-2">🌡️</span>
            <span className="text-sm text-white/60">Feels Like</span>
          </div>
          <p className="text-2xl font-medium">{Math.round(weather.main.feels_like)}°</p>
          <p className="text-xs text-white/50">
            Feel like humidity is making it feel hotter.
          </p>
        </div>

        <div className="glass-dark rounded-2xl p-4">
          <div className="flex items-center mb-2">
            <span className="text-lg mr-2">💨</span>
            <span className="text-sm text-white/60">Wind</span>
          </div>
          <p className="text-2xl font-medium">{Math.round(weather.wind.speed)} m/s</p>
          <p className="text-xs text-white/50">
            Wind direction: {weather.wind.deg}°
          </p>
        </div>
      </div>

      {/* Sun Times */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-lg mr-2">🌅</span>
          <div>
            <p className="text-sm text-white/60">Sunrise</p>
            <p className="text-sm font-medium">{formatTime(weather.sys.sunrise)}</p>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-lg mr-2">🌇</span>
          <div>
            <p className="text-sm text-white/60">Sunset</p>
            <p className="text-sm font-medium">{formatTime(weather.sys.sunset)}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 