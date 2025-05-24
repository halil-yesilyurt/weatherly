import { WeatherData, ForecastData, LocationData } from '@/types/weather';
import { demoWeatherData, demoForecastData } from './demoData';

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || 'demo_key';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const USE_DEMO_DATA = API_KEY === 'demo_key' || API_KEY === 'your_api_key_here';

class WeatherService {
  private async fetchWeatherData(endpoint: string): Promise<WeatherData | ForecastData> {
    try {
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`Weather API Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Weather API Error:', error);
      throw error;
    }
  }

  async getCurrentWeatherByCity(city: string): Promise<WeatherData> {
    if (USE_DEMO_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { ...demoWeatherData, name: city };
    }
    
    const endpoint = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    return this.fetchWeatherData(endpoint) as Promise<WeatherData>;
  }

  async getCurrentWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    if (USE_DEMO_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return demoWeatherData;
    }
    
    const endpoint = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    return this.fetchWeatherData(endpoint) as Promise<WeatherData>;
  }

  async getForecastByCity(city: string): Promise<ForecastData> {
    if (USE_DEMO_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      return { ...demoForecastData, city: { ...demoForecastData.city, name: city } };
    }
    
    const endpoint = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    return this.fetchWeatherData(endpoint) as Promise<ForecastData>;
  }

  async getForecastByCoords(lat: number, lon: number): Promise<ForecastData> {
    if (USE_DEMO_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      return demoForecastData;
    }
    
    const endpoint = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    return this.fetchWeatherData(endpoint) as Promise<ForecastData>;
  }

  getWeatherIconUrl(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }

  formatTemperature(temp: number, unit: 'celsius' | 'fahrenheit' = 'celsius'): string {
    if (unit === 'fahrenheit') {
      return `${Math.round((temp * 9/5) + 32)}°F`;
    }
    return `${Math.round(temp)}°C`;
  }

  getCurrentPosition(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (USE_DEMO_DATA) {
        // Simulate geolocation delay and return demo coordinates
        setTimeout(() => {
          resolve({
            latitude: 51.5085,
            longitude: -0.1257,
          });
        }, 800);
        return;
      }

      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          let errorMessage = 'Unable to retrieve location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }
}

export const weatherService = new WeatherService(); 