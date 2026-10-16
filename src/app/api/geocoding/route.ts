import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim() ?? '';
  if (query.length < 2 || query.length > 100) {
    return NextResponse.json({ results: [] });
  }
  try {
    const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
    url.searchParams.set('name', query);
    url.searchParams.set('count', '10');
    url.searchParams.set('language', 'en');
    url.searchParams.set('format', 'json');
    const response = await fetch(url, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(7000) });
    if (!response.ok) throw new Error('Geocoding unavailable');
    const data = await response.json();
    const results = (data.results ?? []).map((city: { name: string; latitude: number; longitude: number; country_code: string; admin1?: string }) => ({
      name: city.name, lat: city.latitude, lon: city.longitude, country: city.country_code, state: city.admin1,
    }));
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ error: 'Location search unavailable', results: [] }, { status: 502 });
  }
}
