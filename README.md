# Weatherly ☀️

A small, responsive weather app built as a frontend portfolio project.

**What it does:** Search cities worldwide, view live conditions, an hourly temperature chart and seven-day forecast, save favorites, switch between °C and °F, and explore random cities on the map. It includes light/dark themes, weather illustrations, and helpful loading and error states.

## Stack

Next.js 15 · React 19 · TypeScript · Tailwind CSS · Open-Meteo · OpenStreetMap

Weather and city search run through Next.js API routes. Preferences are stored in your browser; no accounts, database, or API keys required.

## Run locally

```bash
npm ci
npm run dev
```

Visit http://localhost:3000.

## Checks

```bash
npm run type-check
npm run lint
npm run build
npm audit
```

Open an invalid URL to try the 404 page. Use DevTools to check mobile widths and the API error states.

## Links & credits

- [Source code](https://github.com/halil-yesilyurt/weatherly)
- Forecast and geocoding data: [Open-Meteo](https://open-meteo.com/), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- Map data: [OpenStreetMap](https://www.openstreetmap.org/)

Personal portfolio demo. Review Open-Meteo's API usage terms before using it for commercial purposes.
