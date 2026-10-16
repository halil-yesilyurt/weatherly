'use client';

import Link from 'next/link';

import { useCallback, useEffect, useRef, useState } from 'react';
import { weatherService, type GeocodeResult } from '@/services/weatherService';
import type { WeatherData, ForecastData, TemperatureUnit } from '@/types/weather';
import DiscoverCities from '@/components/DiscoverCities';
import LocationMap from '@/components/LocationMap';
import WeatherGlyph from '@/components/WeatherGlyph';

type City = GeocodeResult;
const DEFAULT_CITY: City = { name: 'London', country: 'GB', lat: 51.5072, lon: -0.1276 };
const STORAGE_KEY = 'weatherly-preferences-v2';
const symbols: Record<string, string> = { '01':'☀️','02':'🌤️','03':'⛅','04':'☁️','09':'🌧️','10':'🌦️','11':'⛈️','13':'❄️','50':'🌫️' };
function symbol(code: string) { return symbols[code.slice(0,2)] ?? '🌤️'; }
function formatHour(timestamp: number, timezone: number) {
  return new Date((timestamp + timezone) * 1000).toLocaleTimeString('en-GB', { timeZone: 'UTC', hour:'2-digit', minute:'2-digit' });
}
export default function Home() {
  const [city, setCity] = useState<City>(DEFAULT_CITY);
  const [favorites, setFavorites] = useState<City[]>([]);
  const [unit, setUnit] = useState<TemperatureUnit>('celsius');
  const [dark, setDark] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const requestId = useRef(0);
  const [hydrated, setHydrated] = useState(false);
  const latestQuery = useRef(0);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (saved.city && typeof saved.city.lat === 'number' && typeof saved.city.lon === 'number') setCity(saved.city);
      if (Array.isArray(saved.favorites)) setFavorites(saved.favorites.filter((x: City) => typeof x.lat === 'number' && typeof x.lon === 'number').slice(0, 8));
      if (saved.unit === 'fahrenheit') setUnit('fahrenheit');
      if (typeof saved.dark === 'boolean') setDark(saved.dark);
    } catch { /* Invalid saved preferences are ignored */ }
    const params = new URLSearchParams(window.location.search);
    const lat = Number(params.get('lat'));
    const lon = Number(params.get('lon'));
    if (params.has('lat') && params.has('lon') && Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180) {
      setCity({lat,lon,name:(params.get('city')||'Shared location').slice(0,100),country:''});
    }
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify({city,favorites,unit,dark}));
  }, [city,favorites,unit,dark,hydrated]);

  const loadWeather = useCallback(async (selected: City) => {
    const id = ++requestId.current;
    setLoading(true);
    setError('');
    try {
      const bundle = await weatherService.getWeatherBundleByCoords(selected.lat, selected.lon);
      if (id !== requestId.current) return;
      setWeather({ ...bundle.weather, name: selected.name, sys: {...bundle.weather.sys, country: selected.country} });
      setForecast(bundle.forecast);
    } catch (cause) {
      if (id === requestId.current) setError(cause instanceof Error ? cause.message : 'Unable to load forecast');
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, []);
  useEffect(() => { if (hydrated) loadWeather(city); }, [city,loadWeather,hydrated]);

  useEffect(() => {
    const id = ++latestQuery.current;
    if (query.trim().length < 2) { setSuggestions([]); setSearching(false); return; }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setSearching(true);
      try {
        const results = await weatherService.searchCities(query.trim(), 8, controller.signal);
        if (id === latestQuery.current) setSuggestions(results);
      } catch { if (id === latestQuery.current) setSuggestions([]); }
      finally { if (id === latestQuery.current) setSearching(false); }
    }, 300);
    return () => { controller.abort(); clearTimeout(timer); };
  }, [query]);

  const selectCity = (selected: City) => {
    setCity(selected); setQuery(''); setSuggestions([]); setSelectedIndex(-1);
  };
  const searchSubmit = () => {
    const selected = suggestions[selectedIndex] ?? suggestions[0];
    if (selected) selectCity(selected);
  };
  const currentFavorite = favorites.some(x => x.lat === city.lat && x.lon === city.lon);
  const toggleFavorite = () => setFavorites(xs => currentFavorite
    ? xs.filter(x => !(x.lat === city.lat && x.lon === city.lon))
    : [...xs.slice(-7),city]);
  const share = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set('lat',String(city.lat));
    url.searchParams.set('lon',String(city.lon));
    url.searchParams.set('city',city.name);
    try { await navigator.clipboard.writeText(url.toString()); setCopied(true); }
    catch { setError('Could not copy this location link'); }
  };
  const locate = () => weatherService.getCurrentPosition()
    .then(pos => selectCity({name:'Current location',country:'',lat:pos.latitude,lon:pos.longitude}))
    .catch(cause => setError(cause instanceof Error ? cause.message : 'Location unavailable'));
  const temp = (n: number) => Math.round(unit === 'fahrenheit' ? n*9/5+32 : n);
  const suffix = unit === 'fahrenheit' ? '°F' : '°C';
  const daily = forecast?.daily?.slice(0,7) ?? [];
  const next24 = forecast?.list.filter(x => x.dt >= Math.floor(Date.now()/1000)).slice(0,24) ?? [];

  return (
    <main className={dark ? 'weatherly dark-mode' : 'weatherly'}>
      <div className="shell">
        <header className="topbar">
          <Link className="brand" href="/" aria-label="Weatherly home"><span className="brand-icon">☀</span> weatherly<span className="brand-dot">.</span></Link>
          <div className="header-actions">
            <button className="theme-switch" onClick={() => setDark(x=>!x)} aria-label={dark ? 'Use light theme' : 'Use dark theme'} title="Change theme"><span className="theme-moon">☾</span><span className="theme-sun">☀</span><span className="theme-knob" /></button>
            <div className="unit-segment" role="group" aria-label="Temperature unit"><span className="unit-indicator" data-unit={unit}/><button className={unit==='celsius'?'active':''} aria-pressed={unit==='celsius'} onClick={()=>setUnit('celsius')}>°C</button><button className={unit==='fahrenheit'?'active':''} aria-pressed={unit==='fahrenheit'} onClick={()=>setUnit('fahrenheit')}>°F</button></div>
          </div>
        </header>

        <section className="intro">
          <div><p className="eyebrow">YOUR DAILY FORECAST</p><h1>Weather, made simple<span className="accent">.</span></h1><p className="subtitle">Clear skies or cloudy days, stay one step ahead.</p></div>
          <div className="location-search">
            <div className="search-wrap">
              <form onSubmit={e=>{e.preventDefault();searchSubmit();}} role="search">
                <span aria-hidden="true">⌕</span>
                <input aria-label="Search for a city" placeholder="Search for a city..." value={query} onChange={e=>{setQuery(e.target.value);setSelectedIndex(-1);}} onKeyDown={e=>{
                  if(e.key==='ArrowDown'){e.preventDefault();setSelectedIndex(i=>Math.min(i+1,suggestions.length-1));}
                  if(e.key==='ArrowUp'){e.preventDefault();setSelectedIndex(i=>Math.max(-1,i-1));}
                  if(e.key==='Escape'){setQuery('');setSuggestions([]);}
                }} role="combobox" aria-autocomplete="list" aria-expanded={suggestions.length>0} aria-controls="city-results" autoComplete="off"/>
                {searching && <span className="search-spinner" aria-label="Searching">◌</span>}
              </form>
              {suggestions.length>0 && <div id="city-results" className="suggestions" role="listbox">
                {suggestions.map((x,i)=><button key={x.lat+':'+x.lon} className={selectedIndex===i?'active':''} role="option" aria-selected={selectedIndex===i} onClick={()=>selectCity(x)}>{x.name}{x.state?', '+x.state:''} <span>{x.country}</span></button>)}
              </div>}
            </div>
            <button className="location-button" onClick={locate} title="Use my location" aria-label="Use my location">◎ <span>My location</span></button>
          </div>
        </section>

        {favorites.length>0 && <nav className="favorite-strip" aria-label="Favorite cities">{favorites.map(x=><button key={x.lat+':'+x.lon} onClick={()=>selectCity(x)} className={x.lat===city.lat&&x.lon===city.lon?'selected':''}>☆ {x.name}</button>)}</nav>}
        {error && <div className="error-banner" role="alert">{error} <button onClick={()=>loadWeather(city)}>Retry</button></div>}
        {loading && !weather && <div className="dashboard skeleton-dashboard" role="status" aria-label="Loading forecast"><div className="hero panel skeleton-block"/><div className="details panel skeleton-block"/><div className="hourly panel skeleton-block"/><div className="weekly panel skeleton-block"/></div>}
        {weather && <div className={loading?'dashboard updating':'dashboard'}>
          <div className="hero panel">
            <div className="hero-heading">
              <div><p className="eyebrow">CURRENT WEATHER</p><h2>{city.name}{city.country?', '+city.country:''}</h2><p className="date">{new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</p></div>
              <div className="hero-controls"><button className="favorite-button" onClick={share} aria-label="Copy shareable city link" title="Share this city">{copied?'✓':'↗'}</button><button className={'favorite-button '+(currentFavorite?'saved':'')} onClick={toggleFavorite} aria-label={currentFavorite?'Remove favorite city':'Add favorite city'} title={currentFavorite?'Remove from favorites':'Save city'}>{currentFavorite?'★':'☆'}</button></div>
            </div>
            <div className="temperature-display"><div><span className="big-temp" key={unit+city.name}>{temp(weather.main.temp)}°</span><p className="condition">{weather.weather[0].description}</p><p className="feels">Feels like {temp(weather.main.feels_like)}{suffix}</p></div><span className="hero-symbol" key={weather.weather[0].icon} role="img" aria-label={weather.weather[0].description}><WeatherGlyph code={weather.weather[0].icon} size={116}/></span></div>
            <div className="hero-bottom"><span>↑ {temp(weather.main.temp_max)}° High</span><span>↓ {temp(weather.main.temp_min)}° Low</span><span>Updated {formatHour(weather.dt,weather.timezone)} local</span></div>
          </div>
          <div className="details panel"><div className="section-title"><h3>Today&apos;s highlights</h3><span>At a glance</span></div>
            <div className="detail-grid">
              <div className="detail"><span>💧 Humidity</span><strong>{weather.main.humidity}%</strong><small>Relative humidity</small></div>
              <div className="detail"><span>〰 Wind speed</span><strong>{Math.round(weather.wind.speed*3.6)} <em>km/h</em></strong><small>At ground level</small></div>
              <div className="detail"><span>◉ Visibility</span><strong>{Math.round(weather.visibility/1000)} <em>km</em></strong><small>Current visibility</small></div>
              <div className="detail"><span>◷ Pressure</span><strong>{Math.round(weather.main.pressure)} <em>hPa</em></strong><small>Sea-level pressure</small></div>
              <div className="detail"><span>🌅 Sunrise</span><strong>{formatHour(weather.sys.sunrise,weather.timezone)}</strong><small>Local time</small></div>
              <div className="detail"><span>🌇 Sunset</span><strong>{formatHour(weather.sys.sunset,weather.timezone)}</strong><small>Local time</small></div>
            </div>
          </div>
          <section className="hourly panel"><div className="section-title"><h3>Next 24 hours</h3><span>Hourly forecast</span></div>
            <div className="hourly-scroll">{next24.map(x=><div className="hour-cell" key={x.dt}><span>{formatHour(x.dt,forecast?.city.timezone ?? 0)}</span><span className="hour-symbol"><WeatherGlyph code={x.weather[0].icon} size={40}/></span><strong>{temp(x.main.temp)}°</strong><small>💧 {Math.round(x.pop*100)}%</small></div>)}</div>
          </section>
          <section className="weekly panel"><div className="section-title"><h3>7-day forecast</h3><span>This week</span></div>
            <div className="daily-list">{daily.map(x=><div className="day-row" key={x.date}><span className="day-name">{new Date(x.date+'T12:00:00Z').toLocaleDateString('en-US',{weekday:'short',timeZone:'UTC'})}</span><span className="day-condition"><WeatherGlyph code={x.weather.icon} size={34}/> <span>{x.weather.description}</span></span><span className="rain">💧 {x.pop}%</span><div className="temp-track" aria-hidden="true"><span style={{left:(Math.max(0,Math.min(100,(x.min+20)/70*100)))+'%',right:(100-Math.max(0,Math.min(100,(x.max+20)/70*100)))+'%'}}/></div><span className="day-temps">{temp(x.max)}° <small>{temp(x.min)}°</small></span></div>)}</div>
          </section>
          <DiscoverCities currentCity={city.name} unit={unit} onSelect={selectCity}/>
          <div className="map-section panel"><div className="section-title"><div><p className="eyebrow">EXPLORE THE PLACE</p><h3>Where in the world?</h3></div><span>OpenStreetMap</span></div><LocationMap key={city.lat+':'+city.lon} weather={weather}/></div>
        </div>}
        <footer>Weatherly · Forecast data by <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo</a> · Made for curious skies</footer>
      </div>
    </main>
  );
}
