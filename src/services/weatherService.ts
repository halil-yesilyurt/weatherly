import { WeatherData, ForecastData, LocationData } from '@/types/weather';
import { demoWeatherData, demoForecastData } from './demoData';

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || 'demo_key';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

interface GeocodeResult {
  name: string;
  local_names?: { [key: string]: string };
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

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

  private isDemoMode(): boolean {
    return !API_KEY || API_KEY === 'demo_key' || API_KEY === 'your_api_key_here';
  }

  async getCurrentPosition(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
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
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject(new Error('Location access denied by user'));
              break;
            case error.POSITION_UNAVAILABLE:
              reject(new Error('Location information is unavailable'));
              break;
            case error.TIMEOUT:
              reject(new Error('Location request timed out'));
              break;
            default:
              reject(new Error('An unknown error occurred'));
              break;
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }

  async searchCities(query: string, limit: number = 5): Promise<GeocodeResult[]> {
    if (this.isDemoMode()) {
      // Return demo cities for demo mode
      const demoCities = [
        { name: 'London', lat: 51.5074, lon: -0.1278, country: 'GB' },
        { name: 'New York', lat: 40.7128, lon: -74.0060, country: 'US' },
        { name: 'Tokyo', lat: 35.6762, lon: 139.6503, country: 'JP' },
        { name: 'Paris', lat: 48.8566, lon: 2.3522, country: 'FR' },
        { name: 'Sydney', lat: -33.8688, lon: 151.2093, country: 'AU' }
      ];
      
      return demoCities
        .filter(city => city.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, limit);
    }

    if (!query || query.length < 2) return [];

    try {
      const response = await fetch(
        `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=${limit}&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }

      const data: GeocodeResult[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching cities:', error);
      return [];
    }
  }

  async getCurrentWeatherByCity(city: string): Promise<WeatherData> {
    if (this.isDemoMode()) {
      // Return demo data with the requested city name
      const modifiedDemo = { ...demoWeatherData };
      modifiedDemo.name = city;
      modifiedDemo.dt = Math.floor(Date.now() / 1000);
      modifiedDemo.main.temp = 15 + Math.random() * 20; // Random temp between 15-35°C
      return modifiedDemo;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`City "${city}" not found. Please check the spelling and try again.`);
        }
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data: WeatherData = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch weather data');
    }
  }

  async getCurrentWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    if (this.isDemoMode()) {
      return demoWeatherData;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data: WeatherData = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch weather data');
    }
  }

  async getForecastByCity(city: string): Promise<ForecastData> {
    if (this.isDemoMode()) {
      const modifiedDemo = { ...demoForecastData };
      modifiedDemo.city.name = city;
      return modifiedDemo;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`City "${city}" not found. Please check the spelling and try again.`);
        }
        throw new Error(`Forecast API error: ${response.status}`);
      }

      const data: ForecastData = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch forecast data');
    }
  }

  async getForecastByCoords(lat: number, lon: number): Promise<ForecastData> {
    if (this.isDemoMode()) {
      return demoForecastData;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Forecast API error: ${response.status}`);
      }

      const data: ForecastData = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch forecast data');
    }
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
}

export const weatherService = new WeatherService(); 