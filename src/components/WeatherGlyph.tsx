'use client';
import { useId } from 'react';

export default function WeatherGlyph({code,size=96,className=''}:{code:string;size?:number;className?:string}) {
  const id=useId().replace(/:/g,'');
  const kind=code.slice(0,2);
  const night=code.endsWith('n');
  const cloud = <g fill={'url(#cloud'+id+')'} stroke="#d4e2ea" strokeWidth="1.5">
    <path d="M33 74c-12 0-19-8-19-18 0-10 8-18 18-18 3 0 6 1 9 2 4-14 15-23 29-23 17 0 29 13 29 29 10 1 17 9 17 19 0 11-8 19-20 19H33Z" transform="translate(2 7) scale(.88)"/>
  </g>;
  return <svg className={className} width={size} height={size} viewBox="0 0 128 128" role="img" aria-label={kind==='01'?'Clear':kind==='13'?'Snow':kind==='09'||kind==='10'?'Rainy':'Cloudy'} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id={'sun'+id} x1="0" x2="1" y1="0" y2="1"><stop stopColor="#FFDF93"/><stop offset="1" stopColor="#FFAC53"/></linearGradient>
      <linearGradient id={'cloud'+id} x1="0" x2="0.6" y1="0" y2="1"><stop stopColor="#fff"/><stop offset="1" stopColor="#dce8f2"/></linearGradient>
    </defs>
    {(kind==='01'||kind==='02'||kind==='03'||kind==='10') &&
      <g className="weather-glyph-sun">
        {night?<path d="M70 12c-23 14-25 46-5 59 12 9 27 7 37 2-10 17-38 25-57 9-21-16-17-51 5-65 6-3 13-5 20-5Z" fill="#e9edff"/>:<>
          {Array.from({length:8},(_,i)=><path key={i} d="M57 5v10" stroke="#f4bc68" strokeWidth="4" strokeLinecap="round" transform={'rotate('+i*45+' 57 47)'}/>)}
          <circle cx="57" cy="47" r="26" fill={'url(#sun'+id+')'}/>
        </>}
      </g>}
    {kind!=='01' && cloud}
    {(kind==='09'||kind==='10'||kind==='11')&&<g stroke="#64b5d5" strokeWidth="5" strokeLinecap="round" className="weather-glyph-rain"><path d="m41 100-5 10m25-10-5 10m25-10-5 10"/></g>}
    {kind==='13'&&<g fill="#78b5d7" fontSize="24" fontWeight="700"><text x="34" y="114">✳</text><text x="72" y="114">✳</text></g>}
    {kind==='50'&&<g stroke="#9eacb6" strokeWidth="4" strokeLinecap="round"><path d="M24 98h80M32 110h63"/></g>}
    {kind==='11'&&<path d="m65 75-14 22h13l-8 24 29-33H71l10-13" fill="#f9bd64"/>}
  </svg>;
}
