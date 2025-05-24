'use client';

import { ForecastData } from '@/types/weather';

interface HourlyForecastProps {
  forecast: ForecastData;
}

export default function HourlyForecast({ forecast }: HourlyForecastProps) {
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

  const formatHour = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  // Get next 12 hours of forecast
  const hourlyData = forecast.list.slice(0, 12);

  return (
    <div className="glass rounded-3xl p-6 text-white">
      <h3 className="text-lg font-medium mb-4 text-white/80">Hourly Forecast</h3>
      <div className="flex overflow-x-auto space-x-4 pb-2">
        {hourlyData.map((item, index) => (
          <div
            key={index}
            className="flex-shrink-0 text-center min-w-[80px] glass-dark rounded-2xl p-4"
          >
            <p className="text-sm text-white/60 mb-2">
              {index === 0 ? 'Now' : formatHour(item.dt)}
            </p>
            <div className="text-2xl mb-2">
              {getWeatherIcon(item.weather[0].icon)}
            </div>
            <p className="text-lg font-medium">
              {Math.round(item.main.temp)}°
            </p>
            <p className="text-xs text-white/50 mt-1">
              {Math.round(item.pop * 100)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
} 