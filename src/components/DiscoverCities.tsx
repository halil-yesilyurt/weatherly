'use client';

import { useCallback, useEffect, useState } from 'react';
import type { GeocodeResult } from '@/services/weatherService';
import { weatherService } from '@/services/weatherService';
import type { WeatherData, TemperatureUnit } from '@/types/weather';
import WeatherGlyph from '@/components/WeatherGlyph';

const places: GeocodeResult[] = [
  {name:'Kyoto', country:'JP',lat:35.0116,lon:135.7681},
  {name:'Reykjavík',country:'IS',lat:64.1466,lon:-21.9426},
  {name:'Cape Town',country:'ZA',lat:-33.9249,lon:18.4241},
  {name:'Barcelona',country:'ES',lat:41.3874,lon:2.1686},
  {name:'Vancouver',country:'CA',lat:49.2827,lon:-123.1207},
  {name:'Marrakesh',country:'MA',lat:31.6295,lon:-7.9811},
  {name:'Istanbul',country:'TR',lat:41.0082,lon:28.9784},
  {name:'Singapore',country:'SG',lat:1.3521,lon:103.8198},
  {name:'Oslo',country:'NO',lat:59.9139,lon:10.7522},
  {name:'Buenos Aires',country:'AR',lat:-34.6037,lon:-58.3816},
  {name:'New York',country:'US',lat:40.7128,lon:-74.0060},
  {name:'Sydney',country:'AU',lat:-33.8688,lon:151.2093},
];
type CardState = {place:GeocodeResult; weather:WeatherData|null; loading:boolean};
function pickThree(exclude: string) {
  const sorted = places.filter(p=>p.name!==exclude).map(p=>({place:p,weight:Math.random()})).sort((a,b)=>a.weight-b.weight);
  return sorted.slice(0,3).map(({place})=>place);
}
export default function DiscoverCities({onSelect,unit,currentCity}:{onSelect:(city:GeocodeResult)=>void;unit:TemperatureUnit;currentCity:string}) {
  const [cards,setCards] = useState<CardState[]>([]);
  const [round,setRound] = useState(0);
  const [refreshing,setRefreshing] = useState(false);
  const refresh=useCallback(async (signal:AbortSignal)=>{
    const selected=pickThree(currentCity);
    setCards(selected.map(place=>({place,weather:null,loading:true})));
    await Promise.all(selected.map(async place=>{
      try {
        const bundle=await weatherService.getWeatherBundleByCoords(place.lat,place.lon,signal);
        if(!signal.aborted) setCards(prev=>prev.map(row=>row.place.name===place.name?{...row,loading:false,weather:bundle.weather}:row));
      } catch {if(!signal.aborted) setCards(prev=>prev.map(row=>row.place.name===place.name?{...row,loading:false}:row));}
    }));
    if(!signal.aborted) setRefreshing(false);
  },[currentCity]);
  useEffect(()=>{
    const controller=new AbortController();
    void refresh(controller.signal);
    return ()=>controller.abort();
  },[round,refresh]);
  return <section className="discover panel">
    <div className="section-title discover-heading"><div><p className="eyebrow">SOMEWHERE ELSE</p><h3>Around the world <span className="discover-star">✳</span></h3><p className="discover-caption">A little window into the weather elsewhere.</p></div><button type="button" className="refresh-button" disabled={refreshing} onClick={()=>{setRefreshing(true);setRound(n=>n+1)}}><span className={refreshing?'rotating':''} aria-hidden="true">↻</span> Shuffle cities</button></div>
    <div className="city-grid">{cards.map((card,index)=><button key={card.place.name} type="button" className={'city-tile '+(card.loading?'city-loading':'')} style={{animationDelay:index*110+'ms'}} onClick={()=>onSelect(card.place)}>
      <span className="city-tile-top"><span className="city-number">0{index+1} / WORLD</span><span aria-hidden="true">↗</span></span>
      <span className="city-tile-main"><span><strong>{card.place.name}</strong><small>{card.place.country}</small></span><span className="city-icon">{card.loading?'':<WeatherGlyph code={card.weather?.weather[0]?.icon??'02d'} size={72}/>}</span></span>
      <span className="city-tile-foot">{card.loading?<span className="city-skeleton"/>:card.weather?<><span>{card.weather.weather[0].description}</span><strong>{Math.round(unit==='fahrenheit'?card.weather.main.temp*9/5+32:card.weather.main.temp)}°</strong></>:<span>Forecast unavailable</span>}</span>
    </button>)}</div>
  </section>;
}
