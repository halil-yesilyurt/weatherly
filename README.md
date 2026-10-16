# Weatherly ☀️

A responsive weather dashboard for exploring current conditions, hourly forecasts and the week ahead.

## Stack
- Next.js 15 / React 19 / TypeScript
- Tailwind CSS and custom responsive styles
- Open-Meteo forecast and geocoding APIs (via server-side Next.js routes)
- Browser localStorage for favorites, temperature units and theme

## Run locally
```bash
npm install
npm run dev
```

No API key or database is required. The default city is London; search for a location or use the location button to grant optional geolocation access.

## Checks
```bash
npm run type-check
npm run lint
npm run build
```

## Notes
- Forecast data is provided by [Open-Meteo](https://open-meteo.com/). Observe provider usage terms and attribution rules.
- The project is intended as a **noncommercial portfolio demo**.
- The timezone indicator next to sunrise/sunset and last updated time is UTC. Forecast dates follow Open-Meteo's UTC timestamps.
- Favorite cities and display preferences remain in this browser only.
- Geolocation works in secure contexts (HTTPS or localhost). No user accounts or database are used.
