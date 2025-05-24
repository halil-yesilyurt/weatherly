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
      // Comprehensive demo cities for better testing
      const demoCities = [
        // Europe
        { name: 'London', lat: 51.5074, lon: -0.1278, country: 'GB', state: 'England' },
        { name: 'Paris', lat: 48.8566, lon: 2.3522, country: 'FR' },
        { name: 'Berlin', lat: 52.5200, lon: 13.4050, country: 'DE' },
        { name: 'Madrid', lat: 40.4168, lon: -3.7038, country: 'ES' },
        { name: 'Rome', lat: 41.9028, lon: 12.4964, country: 'IT' },
        { name: 'Barcelona', lat: 41.3851, lon: 2.1734, country: 'ES' },
        { name: 'Amsterdam', lat: 52.3676, lon: 4.9041, country: 'NL' },
        { name: 'Vienna', lat: 48.2082, lon: 16.3738, country: 'AT' },
        { name: 'Prague', lat: 50.0755, lon: 14.4378, country: 'CZ' },
        { name: 'Stockholm', lat: 59.3293, lon: 18.0686, country: 'SE' },
        { name: 'Oslo', lat: 59.9139, lon: 10.7522, country: 'NO' },
        { name: 'Copenhagen', lat: 55.6761, lon: 12.5683, country: 'DK' },
        { name: 'Warsaw', lat: 52.2297, lon: 21.0122, country: 'PL' },
        { name: 'Budapest', lat: 47.4979, lon: 19.0402, country: 'HU' },
        { name: 'Istanbul', lat: 41.0082, lon: 28.9784, country: 'TR' },
        { name: 'Athens', lat: 37.9838, lon: 23.7275, country: 'GR' },
        { name: 'Lisbon', lat: 38.7223, lon: -9.1393, country: 'PT' },
        { name: 'Dublin', lat: 53.3498, lon: -6.2603, country: 'IE' },
        { name: 'Brussels', lat: 50.8503, lon: 4.3517, country: 'BE' },
        { name: 'Zurich', lat: 47.3769, lon: 8.5417, country: 'CH' },
        { name: 'Munich', lat: 48.1351, lon: 11.5820, country: 'DE' },
        
        // North America
        { name: 'New York', lat: 40.7128, lon: -74.0060, country: 'US', state: 'New York' },
        { name: 'Los Angeles', lat: 34.0522, lon: -118.2437, country: 'US', state: 'California' },
        { name: 'Chicago', lat: 41.8781, lon: -87.6298, country: 'US', state: 'Illinois' },
        { name: 'Toronto', lat: 43.6532, lon: -79.3832, country: 'CA', state: 'Ontario' },
        { name: 'Vancouver', lat: 49.2827, lon: -123.1207, country: 'CA', state: 'British Columbia' },
        { name: 'Miami', lat: 25.7617, lon: -80.1918, country: 'US', state: 'Florida' },
        { name: 'San Francisco', lat: 37.7749, lon: -122.4194, country: 'US', state: 'California' },
        { name: 'Seattle', lat: 47.6062, lon: -122.3321, country: 'US', state: 'Washington' },
        { name: 'Boston', lat: 42.3601, lon: -71.0589, country: 'US', state: 'Massachusetts' },
        { name: 'Washington', lat: 38.9072, lon: -77.0369, country: 'US', state: 'District of Columbia' },
        { name: 'Las Vegas', lat: 36.1699, lon: -115.1398, country: 'US', state: 'Nevada' },
        { name: 'Mexico City', lat: 19.4326, lon: -99.1332, country: 'MX' },
        
        // Asia
        { name: 'Tokyo', lat: 35.6762, lon: 139.6503, country: 'JP' },
        { name: 'Seoul', lat: 37.5665, lon: 126.9780, country: 'KR' },
        { name: 'Beijing', lat: 39.9042, lon: 116.4074, country: 'CN' },
        { name: 'Shanghai', lat: 31.2304, lon: 121.4737, country: 'CN' },
        { name: 'Mumbai', lat: 19.0760, lon: 72.8777, country: 'IN' },
        { name: 'Delhi', lat: 28.7041, lon: 77.1025, country: 'IN' },
        { name: 'Bangkok', lat: 13.7563, lon: 100.5018, country: 'TH' },
        { name: 'Singapore', lat: 1.3521, lon: 103.8198, country: 'SG' },
        { name: 'Hong Kong', lat: 22.3193, lon: 114.1694, country: 'HK' },
        { name: 'Manila', lat: 14.5995, lon: 120.9842, country: 'PH' },
        { name: 'Jakarta', lat: -6.2088, lon: 106.8456, country: 'ID' },
        { name: 'Kuala Lumpur', lat: 3.1390, lon: 101.6869, country: 'MY' },
        
        // Oceania
        { name: 'Sydney', lat: -33.8688, lon: 151.2093, country: 'AU' },
        { name: 'Melbourne', lat: -37.8136, lon: 144.9631, country: 'AU' },
        { name: 'Brisbane', lat: -27.4698, lon: 153.0251, country: 'AU' },
        { name: 'Perth', lat: -31.9505, lon: 115.8605, country: 'AU' },
        { name: 'Auckland', lat: -36.8485, lon: 174.7633, country: 'NZ' },
        
        // South America
        { name: 'São Paulo', lat: -23.5505, lon: -46.6333, country: 'BR' },
        { name: 'Rio de Janeiro', lat: -22.9068, lon: -43.1729, country: 'BR' },
        { name: 'Buenos Aires', lat: -34.6118, lon: -58.3960, country: 'AR' },
        { name: 'Santiago', lat: -33.4489, lon: -70.6693, country: 'CL' },
        { name: 'Lima', lat: -12.0464, lon: -77.0428, country: 'PE' },
        { name: 'Bogotá', lat: 4.7110, lon: -74.0721, country: 'CO' },
        
        // Africa & Middle East
        { name: 'Cairo', lat: 30.0444, lon: 31.2357, country: 'EG' },
        { name: 'Lagos', lat: 6.5244, lon: 3.3792, country: 'NG' },
        { name: 'Cape Town', lat: -33.9249, lon: 18.4241, country: 'ZA' },
        { name: 'Johannesburg', lat: -26.2041, lon: 28.0473, country: 'ZA' },
        { name: 'Dubai', lat: 25.2048, lon: 55.2708, country: 'AE' },
        { name: 'Tel Aviv', lat: 32.0853, lon: 34.7818, country: 'IL' },
        { name: 'Casablanca', lat: 33.5731, lon: -7.5898, country: 'MA' }
      ];
      
      // Enhanced search: match city name or country
      const queryLower = query.toLowerCase();
      return demoCities
        .filter(city => 
          city.name.toLowerCase().includes(queryLower) || 
          city.country.toLowerCase().includes(queryLower) ||
          (city.state && city.state.toLowerCase().includes(queryLower))
        )
        .sort((a, b) => {
          // Prioritize exact name matches
          const aNameMatch = a.name.toLowerCase().startsWith(queryLower);
          const bNameMatch = b.name.toLowerCase().startsWith(queryLower);
          if (aNameMatch && !bNameMatch) return -1;
          if (!aNameMatch && bNameMatch) return 1;
          return 0;
        })
        .slice(0, limit);
    }

    if (!query || query.length < 2) return [];

    try {
      // Enhanced query to get more comprehensive results
      const response = await fetch(
        `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=${Math.min(limit * 2, 10)}&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }

      const data: GeocodeResult[] = await response.json();
      
      // Sort results by importance (prioritize major cities and exact matches)
      const sortedData = data.sort((a, b) => {
        const aExactMatch = a.name.toLowerCase() === query.toLowerCase();
        const bExactMatch = b.name.toLowerCase() === query.toLowerCase();
        
        if (aExactMatch && !bExactMatch) return -1;
        if (!aExactMatch && bExactMatch) return 1;
        
        // Prioritize major cities by country importance
        const majorCountries = ['US', 'GB', 'FR', 'DE', 'IT', 'ES', 'JP', 'CN', 'IN', 'BR', 'CA', 'AU'];
        const aCountryIndex = majorCountries.indexOf(a.country);
        const bCountryIndex = majorCountries.indexOf(b.country);
        
        if (aCountryIndex !== -1 && bCountryIndex === -1) return -1;
        if (aCountryIndex === -1 && bCountryIndex !== -1) return 1;
        if (aCountryIndex !== -1 && bCountryIndex !== -1) return aCountryIndex - bCountryIndex;
        
        return 0;
      });
      
      return sortedData.slice(0, limit);
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