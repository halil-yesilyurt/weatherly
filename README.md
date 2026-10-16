# Weatherly ☀️

**Weather, made simple.** A responsive weather dashboard that makes it easy to check the forecast, explore new places, and keep your favorite cities close. Built as a polished, practical frontend portfolio project.

**[Live demo](https://weatherly.halilyesilyurt.com)** · **[Source code](https://github.com/halil-yesilyurt/weatherly)**

## The experience

Weatherly turns forecast data into a clear, interactive dashboard instead of a wall of numbers.

- **Find your city:** Search locations around the world with autocomplete, keyboard navigation, and a dedicated search action. Use browser geolocation to jump to your current position.
- **See the bigger picture:** Check current conditions, feels-like temperature, humidity, wind, pressure, visibility, sunrise, and sunset alongside an hourly temperature trend and a seven-day forecast.
- **Explore:** Browse three discoverable cities at a time, shuffle for new suggestions, and view the selected location on an OpenStreetMap-based map.
- **Make it yours:** Save up to eight favorite cities, switch between Celsius and Fahrenheit, and choose light or dark mode. Your preferences persist in the browser.
- **Share a forecast:** Copy a link that opens the dashboard at the selected coordinates.

The interface includes responsive cards, custom weather illustrations, subtle motion, scrollable hourly forecasts, and dedicated loading, empty, and error states. Reduced-motion preferences are respected.

## Built with

| | |
| --- | --- |
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS |
| **Weather & search** | Open-Meteo forecast and geocoding APIs |
| **Maps** | OpenStreetMap |
| **Deployment** | Vercel |

## Under the hood

Weatherly uses Next.js API routes as a small server-side layer between the UI and Open-Meteo. Forecast and geocoding requests stay in one place, with upstream errors handled before responses reach the interface. Weather requests use a server-side revalidation window to avoid unnecessary repeat fetching.

Search suggestions are debounced and outdated requests are canceled. Weather responses are checked against the latest selected city to prevent stale results from replacing newer ones.

Favorites, theme, units, and the last selected city live in `localStorage`. There are **no accounts, database, or API keys** to configure. Geolocation requires browser permission.

## Run locally

Requires Node.js and npm.

```bash
git clone https://github.com/halil-yesilyurt/weatherly.git
cd weatherly
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No `.env` file is required for the weather features.

### Quality checks

```bash
npm run type-check
npm run lint
npm run build
npm audit --omit=dev
```

## Scope and credits

Weatherly is a personal portfolio demo, not an official weather-alert service. Forecast quality and availability depend on Open-Meteo and the user's connection. Browser settings and favorites are local to each device; they are not synchronized across browsers.

- Weather and geocoding: [Open-Meteo](https://open-meteo.com/) ([CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)).
- Map data: [OpenStreetMap contributors](https://www.openstreetmap.org/copyright).

Review each provider's terms before adapting the project for commercial use.
