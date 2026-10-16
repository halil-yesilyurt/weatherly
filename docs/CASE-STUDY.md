# Weatherly — Product Case Study

## Overview

Weatherly is a personal, noncommercial frontend portfolio project. The goal was to turn a small weather API demo into a usable, visual-first product without inventing accounts, subscriptions or other backend complexity.

**Role:** Frontend engineering, interface design, UX and integration.

**Stack:** Next.js App Router, React, TypeScript, Tailwind CSS/custom styles, Open-Meteo, OpenStreetMap.

## The challenge

Weather dashboards are easy to overcrowd. The original experiment offered useful features — including random cities and a location map — but the experience lacked a consistent hierarchy. A later minimalist revision inadvertently removed some of that personality. The redesign needed to preserve those exploratory elements while improving responsiveness, readability and data accuracy.

## Key design decisions

### 1. Lead with the forecast

A condition-aware hero provides the important temperature, weather, daily high/low and selected location. The theme shifts by weather condition without changing the layout or making the interface hard to scan.

### 2. Keep discovery playful

The **Around the world** section brings back randomized cities. Each card resolves independently, so one slow forecast does not need to freeze the whole group. An OpenStreetMap embed provides geographical context.

### 3. Treat interactions as part of the product

- City suggestions are backed by Open-Meteo geocoding, not a locally maintained city database.
- Debounced search, keyboard navigation and explicit empty/error states help users find destinations.
- Location sharing is opt-in and requires browser permission.
- Favorites, display units and theme persist locally without account creation.
- Loading skeletons and motion-reduction support make changes less abrupt.

### 4. Make the underlying data trustworthy

Weatherly moved from direct browser-side vendor requests to Next.js API handlers, allowing server-managed caching, parameter validation and a stable response contract. Forecast views use the provider's hourly and daily data rather than estimating daily extremes from individual forecast hours. City coordinates avoid ambiguity between similarly named places.

### 5. Plan for failure, not only perfect demos

A branded 404 page, error boundary, API retry actions, offline behavior and search-no-results state ensure the demo is understandable even when an upstream request fails.

## Trade-offs

Weatherly intentionally has no account system or database. Browser-stored favorites do not sync across devices. The map uses an embedded OpenStreetMap view rather than an expensive custom mapping SDK. Forecast data depends on Open-Meteo availability and licensing. The project aims to show product craft, not to replicate a commercial weather service.

## What to demonstrate to employers

1. **Visual polish:** desktop hero, custom weather illustrations, typography, small interactions.
2. **Responsive craftsmanship:** a mobile capture next to the desktop layout.
3. **Reliability:** a short clip of search, saved cities, and API error handling.
4. **Engineering:** server-side fetch/caching, geographical/time-zone data handling, type safety and CI.

### Screenshots to add before publishing the case study

Place actual product captures in `docs/screenshots/` (desktop 1440 px, mobile 390 px, and search interaction). Screenshots are intentionally not fabricated or added here before real visual verification.

## Validation status

CI covers dependency installation, TypeScript, lint and a production build. This does not constitute a browser E2E test, Lighthouse measurement or a clean dependency security audit. Record actual results before making those claims in a résumé or portfolio.

## Credits

Forecast and geocoding: [Open-Meteo](https://open-meteo.com/) — [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Mapping: [OpenStreetMap](https://www.openstreetmap.org/).
