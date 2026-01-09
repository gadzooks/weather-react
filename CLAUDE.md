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
- Frontend: Render.com dashboard
- Backend API: AWS API Gateway + Lambda

**Render.com Configuration:**
- **Node Version:** `24.x`
- **Build Command:** `yarn build`
- **Publish Directory:** `dist`
- **Environment Variables:**
  - `VITE_WEATHER_API` - Backend API endpoint
  - `VITE_WEATHER_JWT_TOKEN` - JWT authentication token

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

## Recent Development Focus

- Area charts for cloud cover visualization with 100% reference line
- Chart legend refinements
- Mobile-first dark mode redesign
- API retry logic implementation (6 retries, 10s timeout)
- Location details table optimization
- Migration to Yarn package manager
