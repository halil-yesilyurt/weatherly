export default function LoadingPage() {
  return <main className="weatherly"><div className="shell"><div className="topbar"><span className="brand"><span className="brand-icon" aria-hidden="true"/> weatherly<span className="brand-dot">.</span></span></div><div className="state-loading"><span className="state-loading-sun" aria-hidden="true">☀</span><p role="status">Looking up the forecast…</p></div></div></main>;
}
