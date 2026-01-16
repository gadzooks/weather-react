# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Weather forecast visualization app built with React 19.0 + TypeScript 5.x, using Vite as the build tool. Displays weather forecasts in a table format with detailed views and charts powered by Recharts. Mobile-first dark mode design optimized for iPhone.

**Note:** The project was migrated from Create React App to Vite - ignore outdated CRA references in README.md.

## Development Commands

**Package Manager:** This project uses Yarn (Node 24.x required)

```bash
# Development
yarn dev                 # Start dev server on port 3000

# Building
yarn build               # Production build → dist/ directory
yarn build:qa            # QA environment build
yarn build:production    # Production environment build
yarn preview             # Preview production build on port 8080

# Testing
yarn test                # Run tests once
yarn test:watch          # Watch mode for tests
yarn test:coverage       # Generate coverage report

# Code Quality
yarn lint                # ESLint with auto-fix
yarn prettier            # Check formatting
yarn prettier:fix        # Auto-format code
```

## Environment Setup

**Required environment variables** (create `.env` file):
```
VITE_WEATHER_API=https://weather-expressjs-api.onrender.com
VITE_WEATHER_JWT_TOKEN=<your-jwt-token>
```

**Alternative API endpoints:**
- AWS Lambda: `https://4gpn105y9k.execute-api.us-west-1.amazonaws.com/latest`
- Local dev: `http://localhost:4000`

**Node version:** 24.x required

## Architecture

### Data Flow

```
API (VITE_WEATHER_API)
  ↓ fetchWithRetries (6 retries, 10s timeout)
SummaryTableLoader (fetch + dispatch)
  ↓ mergeForecast action
Redux Store (forecastSlice)
  ↓ useAppSelector
Components (SummaryTable → Region → Location)
```

### State Management

**Redux Store** (`src/app/store.ts`):
- `forecast`: ForecastResponseStatus (isLoaded, error, forecast data)

**Custom hooks** (`src/app/hooks.ts`):
- `useAppDispatch`: Typed dispatch hook
- `useAppSelector`: Typed selector hook

**Local state**: Used for UI interactions (selected location, daily filters stored in localStorage)

### Data Normalization

Forecast data is normalized with `byId` + `allIds` pattern for efficient updates:

```typescript
ForecastResponse {
  dates: string[]                    // ["2024-01-01", "2024-01-02", ...]
  regions: { byId: {}, allIds: [] }  // Normalized regions
  locations: { byId: {}, allIds: [] }
  forecasts: { byId: {} }            // Keyed by location name
  alertsById: {}                     // Weather alerts by ID
  allAlertIds: string[]
}
```

### Component Hierarchy

```
App
└── SummaryTableLoader (data fetching container)
    ├── SummaryTable (weather grid table)
    │   ├── Region (regional section, one per region)
    │   │   └── Location (location row with daily forecast icons)
    │   └── AlertDetail (displays weather alerts)
    └── LocationDetail (detailed view modal/panel)
        └── LocationDetailChart (Recharts: temps, precip, cloud cover)
```

### API Integration

**Endpoint:** `{VITE_WEATHER_API}/forecasts/{dataSource}`
- `dataSource`: 'mock' or 'real'
- **Auth:** Bearer token from `VITE_WEATHER_JWT_TOKEN`
- **Retry logic:** 6 retries with 10-second timeout per request
- **Implementation:** `src/api/retry.ts` - Promise.race pattern for timeout

### Key Directories

- `src/components/weather/forecast_summary/`: Main table view (SummaryTable, Region, Location)
- `src/components/weather/location_details/`: Detailed charts and location info
- `src/components/weather/alerts/`: Alert display components
- `src/interfaces/`: TypeScript interfaces (12 files - normalized data structures)
- `src/features/forecast/`: Redux slice for forecast state
- `src/api/`: Fetch utilities with retry/timeout logic
- `src/utils/`: Date calculations, string utils, icon mappings, localStorage hooks

### Styling

**Dark mode mobile-first design** (optimized for iPhone):
- SCSS/SASS for component styles
- CSS custom properties in `SummaryTable.scss` for theming
- Styled-components and Emotion for some components
- Weekend highlighting with cyan glow + 3px left border
- Weather icons with drop-shadow glow effects
- Sticky headers and columns for scrolling
- Touch targets meet iOS 44x44px minimum

**Global styles:** `src/index.css` (dark mode base, scrollbar, iOS-specific fixes)

## Testing

- **Framework:** Vitest 4.x with jsdom
- **Location:** Tests co-located with components in `src/components/weather/` and `src/utils/`
- **Testing Library:** React Testing Library 16.x for component tests
- **Coverage:** V8 coverage tool (run `yarn test:coverage`)

## Important Implementation Details

### Retry Logic Pattern

API calls use custom retry wrapper with timeout:
```typescript
fetchWithRetries(url, {
  timeout: 10000,    // 10 seconds
  maxRetries: 6,
  ...fetchOptions
})
```

### Normalized State Updates

When updating forecast data, maintain the normalized structure with `byId` + `allIds`. See Redux best practices: https://redux.js.org/usage/structuring-reducers/normalizing-state-shape

### Weekend Calculation

Weekends are pre-calculated in `utils/date.ts` using `calculateWeekends()` and passed as boolean array to child components for performance.

### Weather Icon Mapping

Icon logic in `src/utils/icon.ts` and `src/model/alert.ts`. Weather condition classes in `Location.scss` map to specific colors with glow effects.

## Docker Support

**Development:**
```bash
docker build -t sample:react-app -f Dockerfile.dev .
docker run --rm \
  -v ${PWD}:/app \
  -v /app/node_modules \
  -p 3000:3000 \
  -e VITE_WEATHER_API=http://localhost:4000 \
  sample:react-app
```

**Production:**
```bash
docker build -t react-app-production -f Dockerfile .
docker run -it --rm \
  -p 80:80 \
  -e VITE_WEATHER_API=https://weather-expressjs-api.onrender.com \
  react-app-production
```

## Code Quality

**ESLint:** Airbnb config with TypeScript, React hooks, and accessibility plugins
- Single quotes required
- JSX prop spreading allowed
- No extension required for imports

**Pre-commit:** Husky + lint-staged runs ESLint and Prettier on `.tsx` files

## Deployment

**Hosted on:**

- Frontend: Render.com dashboard (auto-deploys on push to configured branches)
- Backend API: AWS API Gateway + Lambda

**Render.com Configuration:**

**Important:** This project uses Yarn 4.12.0 (specified in `package.json` via `packageManager` field). Corepack must be enabled before running Yarn commands.

- **Node Version:** `24.x`
- **Build Command:** `corepack enable && yarn build`
- **Publish Directory:** `dist`
- **Environment Variables:**
  - `VITE_WEATHER_API` - Backend API endpoint
  - `VITE_WEATHER_JWT_TOKEN` - JWT authentication token

**Why Corepack?** The `packageManager` field in `package.json` indicates this project requires Corepack (included with Node.js 16.9+). Corepack ensures the correct Yarn version (4.12.0) is used. Without `corepack enable`, deployments will fail with version mismatch errors (global Yarn 1.x vs required Yarn 4.x).

**Deploy to S3:**

```bash
# Set AWS profile
export AWS_PROFILE=saa

# Set backend endpoint for build
export VITE_WEATHER_API=https://4gpn105y9k.execute-api.us-west-1.amazonaws.com/latest

# Build and deploy
yarn build
aws s3 sync dist s3://weather-react-static-site
```

## PWA & Offline Support

This app is a Progressive Web App (PWA) with full offline support using `vite-plugin-pwa`.

### How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                        ONLINE MODE                               │
│  User loads app → SW precaches all assets → API fetches data    │
│                  → Data saved to localStorage                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                       OFFLINE MODE                               │
│  User refreshes → SW serves cached assets → App loads cached    │
│                   data from localStorage → Shows offline banner │
└─────────────────────────────────────────────────────────────────┘
```

### Key Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | VitePWA plugin configuration |
| `src/utils/serviceWorkerRegistration.ts` | SW registration using `virtual:pwa-register` |
| `src/utils/forecastCache.ts` | localStorage caching for forecast data |
| `src/components/.../OfflineStatusBanner.tsx` | UI banner showing offline/cached status |

### vite-plugin-pwa Configuration

Located in `vite.config.ts`:

```typescript
VitePWA({
  registerType: 'autoUpdate',  // Auto-update SW when new version available
  includeAssets: [...],        // Additional assets to precache
  manifest: {...},             // Web app manifest (name, icons, theme)
  workbox: {
    globPatterns: [...],       // File patterns to precache
    runtimeCaching: [...]      // Runtime caching strategies
  }
})
```

### Caching Strategies

| Resource | Strategy | Reason |
|----------|----------|--------|
| Static assets (JS, CSS, HTML) | **Precache** | Cached at SW install time |
| Images, fonts | **Precache** | Part of app shell |
| Google Fonts | **CacheFirst** | Rarely changes, cache for 1 year |
| API `/forecasts/*` | **NetworkOnly** | App handles via localStorage |

### Workbox Strategies Explained

- **Precache**: Assets are fetched and cached during service worker installation. Guaranteed to be available offline.
- **CacheFirst**: Check cache first, fall back to network. Best for assets that rarely change.
- **NetworkFirst**: Try network first, fall back to cache. Best for dynamic content.
- **NetworkOnly**: Never cache, always fetch from network. Used for API calls we handle ourselves.
- **StaleWhileRevalidate**: Serve from cache immediately, update cache in background.

### Offline Data Flow

1. **Online load**: App fetches from API → saves to localStorage via `saveForecastToCache()`
2. **Offline load**: App tries API → fails → loads from localStorage via `loadForecastFromCache()`
3. **Banner display**: `OfflineStatusBanner` shows when `!navigator.onLine` or `isFromCache`

### Testing Offline Mode

```bash
# Build production version (SW only works in production)
yarn build

# Serve locally
yarn preview

# Then in Chrome DevTools:
# 1. Load page (online) - SW installs and precaches
# 2. Application tab → Service Workers → verify "activated"
# 3. Network tab → check "Offline"
# 4. Refresh page - should work with offline banner
```

### Debugging Service Worker

In Chrome DevTools:
- **Application → Service Workers**: See SW status, force update, unregister
- **Application → Cache Storage**: Inspect cached assets (`workbox-precache-*`)
- **Console**: Look for `[SW]` prefixed logs

### Common Issues

| Issue | Solution |
|-------|----------|
| SW not updating | Hard refresh (Cmd+Shift+R) or "Update on reload" in DevTools |
| Assets not cached | Check `globPatterns` in vite.config.ts |
| Blank page offline | Check Console for missing assets, verify precache list |
| Old version stuck | Unregister SW in DevTools, clear cache, reload |

### References

- [vite-plugin-pwa docs](https://vite-pwa-org.netlify.app/)
- [Workbox docs](https://developer.chrome.com/docs/workbox/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

## Recent Development Focus

- PWA offline support with vite-plugin-pwa
- Area charts for cloud cover visualization with 100% reference line
- Chart legend refinements
- Mobile-first dark mode redesign
- API retry logic implementation (6 retries, 10s timeout)
- Location details table optimization
- Migration to Yarn package manager
