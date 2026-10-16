import { WeatherData, ForecastData, LocationData } from '@/types/weather';

export interface GeocodeResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

interface WeatherResponse {
  weather: WeatherData;
  forecast: ForecastData;
  source: string;
  updatedAt: string;
}

class WeatherService {
  private async getJSON<T>(url: string, signal?: AbortSignal): Promise<T> {
    const response = await fetch(url, { signal });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error || 'Weather service is temporarily unavailable');
    }
    return response.json() as Promise<T>;
  }

  async getCurrentPosition(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject(new Error('Geolocation is not supported'));
      navigator.geolocation.getCurrentPosition(
        p => resolve({ latitude: p.coords.latitude, longitude: p.coords.longitude }),
        error => reject(new Error(error.code === 1 ? 'Location access denied' : 'Unable to detect your location')),
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
      );
    });
  }

  async searchCities(query: string, limit = 8, signal?: AbortSignal): Promise<GeocodeResult[]> {
    if (query.trim().length < 2) return [];
    const data = await this.getJSON<{ results: GeocodeResult[] }>(
      '/api/geocoding?q=' + encodeURIComponent(query.trim()), signal
    );
    return data.results.slice(0, limit);
  }

  async getWeatherBundleByCoords(lat: number, lon: number, signal?: AbortSignal): Promise<WeatherResponse> {
    return this.getJSON<WeatherResponse>(
      '/api/weather?lat=' + encodeURIComponent(lat) + '&lon=' + encodeURIComponent(lon), signal
    );
  }

  async getWeatherBundleByCity(city: string, signal?: AbortSignal): Promise<WeatherResponse> {
    const results = await this.searchCities(city, 5, signal);
    const exact = results.find(result => result.name.toLocaleLowerCase() === city.trim().toLocaleLowerCase());
    const selected = exact ?? results[0];
    if (!selected) throw new Error('City not found. Try a different search.');
    const bundle = await this.getWeatherBundleByCoords(selected.lat, selected.lon, signal);
    return {
      ...bundle,
      weather: { ...bundle.weather, name: selected.name, sys: { ...bundle.weather.sys, country: selected.country } },
      forecast: { ...bundle.forecast, city: { ...bundle.forecast.city, name: selected.name, country: selected.country } },
    };
  }

  async getCurrentWeatherByCity(city: string): Promise<WeatherData> {
    return (await this.getWeatherBundleByCity(city)).weather;
  }
  async getForecastByCity(city: string): Promise<ForecastData> {
    return (await this.getWeatherBundleByCity(city)).forecast;
  }
  async getCurrentWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    return (await this.getWeatherBundleByCoords(lat, lon)).weather;
  }
  async getForecastByCoords(lat: number, lon: number): Promise<ForecastData> {
    return (await this.getWeatherBundleByCoords(lat, lon)).forecast;
  }
  getWeatherIconUrl(code: string): string {
    return 'https://openweathermap.org/img/wn/' + code + '@2x.png';
  }
  formatTemperature(temp: number, unit: 'celsius' | 'fahrenheit' = 'celsius'): string {
    return Math.round(unit === 'fahrenheit' ? (temp * 9 / 5) + 32 : temp) + (unit === 'fahrenheit' ? '°F' : '°C');
  }
}
export const weatherService = new WeatherService();
