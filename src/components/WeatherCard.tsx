'use client';

import { WeatherData, TemperatureUnit } from '@/types/weather';

interface WeatherCardProps {
  weather: WeatherData;
  unit: TemperatureUnit;
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
      </div>

      {/* Main Temperature */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <span className="text-6xl mr-4">{getWeatherIcon(weather.weather[0].icon)}</span>
          <div>
            <div className="text-6xl font-light">
              {convertTemperature(weather.main.temp)}{getTemperatureSymbol()}
            </div>
            <p className="text-lg text-white/80 capitalize">
              {weather.weather[0].description}
            </p>
          </div>
        </div>
        <p className="text-sm text-white/60">
          L: {convertTemperature(weather.main.temp_min)}{getTemperatureSymbol()} H: {convertTemperature(weather.main.temp_max)}{getTemperatureSymbol()}
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
            The dew point is {convertTemperature(weather.main.feels_like)}{getTemperatureSymbol()} right now.
          </p>
        </div>

        <div className="glass-dark rounded-2xl p-4">
          <div className="flex items-center mb-2">
            <span className="text-lg mr-2">👁️</span>
            <span className="text-sm text-white/60">Visibility</span>
          </div>
          <p className="text-2xl font-medium">{Math.round(weather.visibility / 1000)} km</p>
          <p className="text-xs text-white/50">
            {weather.visibility >= 10000 ? 'Excellent visibility' : 'Haze is affecting visibility.'}
          </p>
        </div>

        <div className="glass-dark rounded-2xl p-4">
          <div className="flex items-center mb-2">
            <span className="text-lg mr-2">🌡️</span>
            <span className="text-sm text-white/60">Feels Like</span>
          </div>
          <p className="text-2xl font-medium">{convertTemperature(weather.main.feels_like)}{getTemperatureSymbol()}</p>
          <p className="text-xs text-white/50">
            {weather.main.feels_like > weather.main.temp 
              ? 'Humidity makes it feel hotter.' 
              : 'Wind makes it feel cooler.'
            }
          </p>
        </div>

        <div className="glass-dark rounded-2xl p-4">
          <div className="flex items-center mb-2">
            <span className="text-lg mr-2">💨</span>
            <span className="text-sm text-white/60">Wind</span>
          </div>
          <p className="text-2xl font-medium">{Math.round(weather.wind.speed)} m/s</p>
          <p className="text-xs text-white/50">
            {weather.wind.speed < 2 ? 'Light breeze' :
             weather.wind.speed < 6 ? 'Moderate wind' : 'Strong wind'}
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