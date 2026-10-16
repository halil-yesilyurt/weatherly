'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorPage({error,reset}:{error:Error & {digest?:string};reset:()=>void}) {
  useEffect(()=>{console.error('Weatherly page error',error);},[error]);
  return <main className="weatherly"><div className="shell"><header className="topbar"><Link href="/" className="brand"><span className="brand-icon" aria-hidden="true"/> weatherly<span className="brand-dot">.</span></Link></header><section className="state-page"><span className="state-symbol" aria-hidden="true">☁</span><p className="eyebrow">TEMPORARY CLOUD COVER</p><h1>Something went off forecast.</h1><p>The page hit an unexpected problem. You can try again without losing your place.</p><div className="state-actions"><button type="button" className="state-primary" onClick={reset}>Try again ↻</button><Link className="state-secondary" href="/">Go home</Link></div></section></div></main>;
}
