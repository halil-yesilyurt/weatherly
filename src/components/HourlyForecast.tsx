'use client';

import { ForecastData, TemperatureUnit } from '@/types/weather';

interface HourlyForecastProps {
  forecast: ForecastData;
  unit: TemperatureUnit;
}

export default function HourlyForecast({ forecast, unit }: HourlyForecastProps) {
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

  const convertTemperature = (temp: number): number => {
    if (unit === 'fahrenheit') {
      return Math.round((temp * 9/5) + 32);
    }
    return Math.round(temp);
  };

  const getTemperatureSymbol = (): string => {
    return unit === 'fahrenheit' ? '°F' : '°C';
  };

  // Get next 24 hours of forecast starting from next hour
  const now = new Date();
  const nextHour = new Date(now);
  nextHour.setHours(now.getHours() + 1, 0, 0, 0);
  
  // Filter forecast data to get items starting from next hour
  const filteredData = forecast.list.filter(item => {
    const itemTime = new Date(item.dt * 1000);
    return itemTime >= nextHour;
  });
  
  // Take first 8 items (24 hours in 3-hour intervals)
  const hourlyData = filteredData.slice(0, 8);

  // Calculate temperature range for visual scaling
  const temps = hourlyData.map(item => item.main.temp);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const tempRange = maxTemp - minTemp;

  const getTemperatureBarHeight = (temp: number): number => {
    if (tempRange === 0) return 50;
    return 20 + ((temp - minTemp) / tempRange) * 60;
  };

  return (
    <div className="glass rounded-3xl p-6 text-white overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-white/80">24-Hour Forecast</h3>
      </div>
      
      <div className="relative">
        {/* Temperature Graph Background */}
        <div className="absolute inset-0 top-12 bottom-16 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl"></div>
        
        <div className="flex overflow-x-auto space-x-1 pb-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {hourlyData.map((item, index) => {
            const tempHeight = getTemperatureBarHeight(item.main.temp);
            const precipitationChance = Math.round(item.pop * 100);
            const isNextHour = index === 0;
            
            return (
              <div
                key={index}
                className={`flex-shrink-0 relative group ${
                  isNextHour ? 'bg-white/10' : 'hover:bg-white/5'
                } rounded-2xl p-3 min-w-[100px] transition-all duration-300 border ${
                  isNextHour ? 'border-white/30' : 'border-transparent'
                }`}
              >
                {/* Time */}
                <div className="text-center mb-3">
                  <p className={`text-sm font-medium ${
                    isNextHour ? 'text-white' : 'text-white/70'
                  }`}>
                    {isNextHour ? 'Next' : formatHour(item.dt)}
                  </p>
                </div>

                {/* Weather Icon */}
                <div className="text-center mb-3">
                  <div className="text-3xl transform group-hover:scale-110 transition-transform duration-300">
                    {getWeatherIcon(item.weather[0].icon)}
                  </div>
                </div>

                {/* Temperature with Visual Bar */}
                <div className="text-center mb-3 relative">
                  <div className="relative h-20 flex items-end justify-center mb-2">
                    <div 
                      className={`w-3 rounded-full transition-all duration-500 ${
                        item.main.temp > (minTemp + maxTemp) / 2 
                          ? 'bg-gradient-to-t from-orange-400 to-red-400'
                          : 'bg-gradient-to-t from-blue-400 to-cyan-400'
                      }`}
                      style={{ height: `${tempHeight}px` }}
                    ></div>
                  </div>
                  <p className={`text-lg font-bold ${
                    isNextHour ? 'text-white' : 'text-white/90'
                  }`}>
                    {convertTemperature(item.main.temp)}{getTemperatureSymbol()}
                  </p>
                </div>

                {/* Weather Description */}
                <div className="text-center mb-2">
                  <p className="text-xs text-white/60 capitalize truncate">
                    {item.weather[0].description}
                  </p>
                </div>

                {/* Precipitation */}
                {precipitationChance > 0 && (
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <span className="text-xs">💧</span>
                      <span className="text-xs text-blue-300 font-medium">
                        {precipitationChance}%
                      </span>
                    </div>
                  </div>
                )}

                {/* Wind Speed Indicator */}
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <div className="text-xs text-white/70 bg-black/50 backdrop-blur-sm rounded-md px-1.5 py-0.5 whitespace-nowrap">
                    🌬 {Math.round(item.wind.speed)}m/s
                  </div>
                </div>

                {/* "Next" indicator */}
                {isNextHour && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Temperature Range Labels */}
        <div className="flex justify-between items-center mt-4 px-3">
          <div className="text-xs text-white/50 flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mr-2"></div>
            Cool: {convertTemperature(minTemp)}{getTemperatureSymbol()}
          </div>
          <div className="text-xs text-white/50 flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-400 rounded-full mr-2"></div>
            Warm: {convertTemperature(maxTemp)}{getTemperatureSymbol()}
          </div>
        </div>
      </div>
    </div>
  );
} 