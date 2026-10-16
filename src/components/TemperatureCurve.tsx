import type { ForecastData, TemperatureUnit } from '@/types/weather';

export default function TemperatureCurve({items,unit}:{items:ForecastData['list'];unit:TemperatureUnit}) {
  if (items.length<2) return null;
  const width=1000,height=160,top=24,bottom=130;
  const values=items.map(item=>unit==='fahrenheit'?(item.main.temp*9/5+32):item.main.temp);
  const min=Math.min(...values)-2, max=Math.max(...values)+2;
  const x=(i:number)=>i/(items.length-1)*width;
  const y=(value:number)=>bottom-(value-min)/(max-min)*(bottom-top);
  const points=values.map((v,i)=>[x(i),y(v)]);
  const line=points.map(([px,py],i)=>(i===0?'M':'L')+px.toFixed(1)+','+py.toFixed(1)).join(' ');
  const fill=line+' L'+width+','+height+' L0,'+height+' Z';
  return <div className="curve-wrap" role="img" aria-label="Temperature trend for the next 24 hours">
    <div className="curve-heading"><span>Temperature trend</span><span>{Math.round(Math.min(...values))}° — {Math.round(Math.max(...values))}°</span></div>
    <svg viewBox={'0 0 '+width+' '+height} preserveAspectRatio="none" width="100%" height="130" aria-hidden="true">
      <defs><linearGradient id="temperature-area" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#75a9d7" stopOpacity=".28"/><stop offset="1" stopColor="#75a9d7" stopOpacity="0"/></linearGradient></defs>
      {[40,85,130].map(v=><line key={v} x1="0" x2={width} y1={v} y2={v} stroke="currentColor" strokeOpacity=".08" strokeDasharray="5 9"/>)}
      <path d={fill} fill="url(#temperature-area)"/>
      <path d={line} fill="none" stroke="#5f9fce" strokeWidth="4" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>;
}
