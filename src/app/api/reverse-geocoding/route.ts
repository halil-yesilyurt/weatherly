import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const latitude = Number(request.nextUrl.searchParams.get('lat'));
  const longitude = Number(request.nextUrl.searchParams.get('lon'));
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180 ||
      !request.nextUrl.searchParams.has('lat') || !request.nextUrl.searchParams.has('lon')) {
    return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
  }
  const params = new URLSearchParams({
    lat: latitude.toFixed(5), lon: longitude.toFixed(5), format: 'jsonv2', addressdetails: '1', zoom: '10',
  });
  try {
    const upstream = await fetch('https://nominatim.openstreetmap.org/reverse?' + params, {
      headers: { 'User-Agent': 'Weatherly-Portfolio/1.0 (https://weatherly.halilyesilyurt.com)' },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(6000),
    });
    if (!upstream.ok) throw new Error('Reverse geocoding unavailable');
    const result = await upstream.json();
    const address = result.address ?? {};
    const name = address.city || address.town || address.village || address.municipality || address.county || address.state;
    if (typeof name !== 'string' || !name.trim()) throw new Error('No locality');
    return NextResponse.json({ name: name.trim(), country: (address.country_code || '').toUpperCase() });
  } catch {
    return NextResponse.json({ error: 'Unable to determine locality' }, { status: 502 });
  }
}
