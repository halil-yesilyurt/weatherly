# Weatherly ☀️

**Weather, made simple.** A personal frontend portfolio project exploring how a familiar weather forecast can feel polished, useful and a little playful.

[View source](https://github.com/halil-yesilyurt/weatherly) · [Product case study](./docs/CASE-STUDY.md)

## The experience

- **Weather at a glance:** current conditions, feels-like temperature, pressure, humidity, visibility, wind and sunrise/sunset.
- **The next hours and days:** hourly forecasts, a temperature trend chart and seven-day outlook.
- **Find your city:** live worldwide geocoding suggestions, coordinate-based selection, optional location permission and shareable city URLs.
- **Explore:** shuffle through three randomly selected world cities, each with its own forecast, and inspect the selected location on OpenStreetMap.
- **Personalize:** save up to eight favorite places, choose Celsius/Fahrenheit and toggle light/dark appearance. Preferences stay on-device.
- **The details:** custom weather SVG artwork, forecast-aware colors, subtle motion, reduced-motion support, keyboard-friendly search, skeletons, and branded error/404 states.

## Technology and decisions

| Area | Implementation |
| --- | --- |
| Frontend | Next.js 15 App Router, React 19, TypeScript |
| Visual system | Manrope, Tailwind CSS, custom CSS, Heroicons and bespoke SVGs |
| Forecast & geocoding | Open-Meteo through server-side Next.js API routes |
| Mapping | OpenStreetMap embed |
| Preferences | Browser localStorage; no account or database |
| Performance | Cached weather API fetches, debounced/cancellable city search, independent discovery-card loading |
| Quality | CI runs type checking, linting and production build |

## Local development

Requires Node.js 20+ and npm.

```bash
git clone https://github.com/halil-yesilyurt/weatherly.git
cd weatherly
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No API key or database is required.

If you want to preview the current redesign before it is merged, use `git switch feat/weatherly-data-foundation` after cloning.

### Project checks

```bash
npm run type-check
npm run lint
npm run build
npm audit
```

The production bundle being buildable does **not** imply there are zero reported dependency vulnerabilities. Review the audit report before deploying. Do not automatically run `npm audit fix --force`: it may upgrade Next.js or Tailwind across breaking versions.

### Manual smoke test

Test widths **320, 375, 430, 768, 850 and 1280 px**. Confirm there is no page-level horizontal scroll. Try searching for a city, a misspelled query, denying geolocation, switching temperature units and themes, reshuffling cities, copying coordinates, and opening an unknown URL to test the 404 page. Use DevTools Network → Offline to check the forecast error/retry state.

## Data and privacy

Forecast and geocoding data come from [Open-Meteo](https://open-meteo.com/), with attribution under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Please review Open-Meteo's separate API usage terms if adapting the project for commercial or high-traffic use.

Weatherly is designed as a personal portfolio demonstration, **not** a commercial weather service. Geolocation is requested only when you press the location control and requires browser permission/HTTPS. Favorite cities, theme and units stay in your browser. Approximate location coordinates are sent to the weather provider when forecasts are requested. No Weatherly user account, backend user database or payment integration exists.

## Project presentation

For a case study or portfolio entry, show: (1) one desktop hero screenshot, (2) a mobile viewport, and (3) the city-search or favorites interaction. Pair images with the engineering decisions documented in [CASE-STUDY.md](./docs/CASE-STUDY.md). **Do not present Lighthouse scores or coverage numbers unless you have measured them.**

---

Made as a frontend portfolio project. Weather data © Open-Meteo contributors, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
