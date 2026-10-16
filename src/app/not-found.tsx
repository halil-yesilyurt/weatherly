import Link from 'next/link';

export default function NotFound() {
  return <main className="weatherly"><div className="shell"><header className="topbar"><Link href="/" className="brand"><span className="brand-icon" aria-hidden="true"/> weatherly<span className="brand-dot">.</span></Link></header><section className="state-page"><span className="state-number">404</span><span className="state-symbol" aria-hidden="true">☁</span><p className="eyebrow">LOST IN THE CLOUDS</p><h1>This page drifted away.</h1><p>We couldn&apos;t find that forecast. Your next sunny destination is just one click away.</p><Link href="/" className="state-primary">Back to Weatherly →</Link></section></div></main>;
}
