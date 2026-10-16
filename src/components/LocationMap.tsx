'use client';

import { useState } from 'react';
import { MapPinIcon, ClipboardDocumentIcon, ArrowTopRightOnSquareIcon, CheckIcon } from '@heroicons/react/24/outline';
import type { WeatherData } from '@/types/weather';

export default function LocationMap({ weather }: { weather: WeatherData | null }) {
  const [copied, setCopied] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [copyError, setCopyError] = useState(false);
  if (!weather) return null;

  const { lat, lon } = weather.coord;
  const label = [weather.name, weather.sys.country].filter(Boolean).join(', ');
  const coordinates = lat.toFixed(4) + '°, ' + lon.toFixed(4) + '°';
  const params = new URLSearchParams({
    bbox: [lon - .1, lat - .1, lon + .1, lat + .1].join(','),
    layer: 'mapnik',
    marker: lat + ',' + lon,
  });
  const mapUrl = 'https://www.openstreetmap.org/export/embed.html?' + params;
  const externalMapUrl = 'https://www.openstreetmap.org/?mlat=' + lat + '&mlon=' + lon + '#map=11/' + lat + '/' + lon;

  async function copyCoordinates() {
    setCopyError(false);
    try {
      await navigator.clipboard.writeText(lat.toFixed(4) + ', ' + lon.toFixed(4));
      setCopied(true);
    } catch {
      setCopied(false);
      setCopyError(true);
    }
  }

  return <div className="location-map">
    <div className="location-map-frame">
      {!mapLoaded && <div className="map-placeholder" role="status">Loading location map…</div>}
      <iframe src={mapUrl} title={'Map showing ' + label} loading="lazy" referrerPolicy="no-referrer-when-downgrade" onLoad={() => setMapLoaded(true)} />
      <div className="map-overlay">
        <span className="map-overlay-marker"><MapPinIcon aria-hidden="true" /></span>
        <span className="map-overlay-copy"><strong>{label || 'Selected location'}</strong><small>{coordinates}</small></span>
      </div>
    </div>
    <div className="location-info-grid">
      <div className="location-info-tile">
        <span className="location-info-label">Coordinates</span>
        <strong>{coordinates}</strong>
      </div>
      <div className="location-info-tile">
        <span className="location-info-label">Country</span>
        <strong>{weather.sys.country || 'Current location'}</strong>
      </div>
    </div>
    <div className="location-actions">
      <a href={externalMapUrl} target="_blank" rel="noopener noreferrer" className="location-action">
        <ArrowTopRightOnSquareIcon aria-hidden="true" /> Open in OpenStreetMap
      </a>
      <button type="button" className="location-action" onClick={copyCoordinates}>
        {copied ? <CheckIcon aria-hidden="true" /> : <ClipboardDocumentIcon aria-hidden="true" />}
        {copied ? 'Coordinates copied' : 'Copy coordinates'}
      </button>
    </div>
    {copyError && <p className="location-copy-error" role="alert">Could not copy coordinates. Check your browser permissions.</p>}
  </div>;
}
