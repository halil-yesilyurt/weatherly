import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';
const weatherCodes: Record<number, [string, string, string]> = {
  0: ['Clear', 'clear sky', '01'], 1: ['Clouds', 'mainly clear', '02'],
  2: ['Clouds', 'partly cloudy', '03'], 3: ['Clouds', 'overcast', '04'],
  45: ['Mist', 'fog', '50'], 48: ['Mist', 'depositing rime fog', '50'],
  51: ['Drizzle', 'light drizzle', '09'], 53: ['Drizzle', 'drizzle', '09'],
  55: ['Drizzle', 'heavy drizzle', '09'], 61: ['Rain', 'light rain', '10'],
  63: ['Rain', 'rain', '10'], 65: ['Rain', 'heavy rain', '10'],
  71: ['Snow', 'light snow', '13'], 73: ['Snow', 'snow', '13'],
  75: ['Snow', 'heavy snow', '13'], 80: ['Rain', 'rain showers', '09'],
  81: ['Rain', 'rain showers', '09'], 82: ['Rain', 'heavy rain showers', '09'],
  95: ['Thunderstorm', 'thunderstorm', '11'], 96: ['Thunderstorm', 'thunderstorm with hail', '11'],
  99: ['Thunderstorm', 'thunderstorm with hail', '11'],
};
function condition(code: number, isDay = true) {
  const [main, description, icon] = weatherCodes[code] ?? ['Clouds', 'cloudy', '04'];
  return { id: code, main, description, icon: icon + (isDay ? 'd' : 'n') };
}
function epoch(time: string): number {
  // Open-Meteo timestamps are timezone-local when timezone=auto. Request UTC for unambiguous parsing.
  return Date.parse(time + 'Z') / 1000;
}
function numberParam(value: string | null, min: number, max: number): number | null {
  if (value === null || value.trim() === '') return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
}
export async function GET(request: NextRequest) {
  const lat = numberParam(request.nextUrl.searchParams.get('lat'), -90, 90);
  const lon = numberParam(request.nextUrl.searchParams.get('lon'), -180, 180);
  if (lat === null || lon === null) return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
  const params = new URLSearchParams({
    latitude: String(lat), longitude: String(lon), timezone: 'GMT',
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m',
    hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m,wind_direction_10m,visibility',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max',
    forecast_days: '8', wind_speed_unit: 'ms',
  });
  try {
    const upstream = await fetch(WEATHER_URL + '?' + params, { next: { revalidate: 600 }, signal: AbortSignal.timeout(9000) });
    if (!upstream.ok) return NextResponse.json({ error: 'Weather provider unavailable' }, { status: 502 });
    const data = await upstream.json();
    if (!data.current || !data.hourly || !data.daily) throw new Error('Incomplete forecast');
    const current = data.current;
    const dayIndex = Math.max(0, data.daily.time.findIndex((d: string) => d === current.time.slice(0, 10)));
    const currentTime = epoch(current.time);
    const sunrise = epoch(data.daily.sunrise[dayIndex]);
    const sunset = epoch(data.daily.sunset[dayIndex]);
    const weather = {
      coord: { lat, lon }, weather: [condition(current.weather_code, Boolean(current.is_day))],
      base: 'open-meteo', main: {
        temp: current.temperature_2m, feels_like: current.apparent_temperature,
        temp_min: data.daily.temperature_2m_min[dayIndex], temp_max: data.daily.temperature_2m_max[dayIndex],
        pressure: current.pressure_msl, humidity: current.relative_humidity_2m,
      },
      visibility: data.hourly.visibility?.[Math.max(0, data.hourly.time.indexOf(current.time.slice(0, 13) + ':00'))] ?? 10000,
      wind: { speed: current.wind_speed_10m, deg: current.wind_direction_10m },
      clouds: { all: current.cloud_cover }, dt: currentTime,
      sys: { country: '', sunrise, sunset }, timezone: 0, id: 0, name: '', cod: 200,
    };
    const list = data.hourly.time.map((t: string, i: number) => ({
      dt: epoch(t), main: {
        temp: data.hourly.temperature_2m[i], feels_like: data.hourly.apparent_temperature[i],
        temp_min: data.hourly.temperature_2m[i], temp_max: data.hourly.temperature_2m[i],
        pressure: current.pressure_msl, humidity: data.hourly.relative_humidity_2m[i],
        sea_level: current.pressure_msl, grnd_level: current.pressure_msl, temp_kf: 0,
      },
      weather: [condition(data.hourly.weather_code[i], Number(t.slice(11, 13)) >= 6 && Number(t.slice(11, 13)) < 18)],
      clouds: { all: 0 }, wind: { speed: data.hourly.wind_speed_10m[i], deg: data.hourly.wind_direction_10m[i], gust: 0 },
      visibility: data.hourly.visibility?.[i] ?? 10000, pop: (data.hourly.precipitation_probability[i] ?? 0) / 100,
      sys: { pod: 'd' }, dt_txt: t,
    }));
    const daily = data.daily.time.map((t: string, i: number) => ({
      date: t, dt: epoch(t + 'T12:00'), min: data.daily.temperature_2m_min[i],
      max: data.daily.temperature_2m_max[i], pop: data.daily.precipitation_probability_max[i] ?? 0,
      weather: condition(data.daily.weather_code[i]),
    }));
    return NextResponse.json({
      weather, forecast: {
        cod: '200', message: 0, cnt: list.length, list,
        city: { id: 0, name: '', coord: { lat, lon }, country: '', population: 0, timezone: 0, sunrise, sunset },
        daily,
      },
      source: 'Open-Meteo', updatedAt: current.time,
    });
  } catch {
    return NextResponse.json({ error: 'Could not load weather data' }, { status: 502 });
  }
}
