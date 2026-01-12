# Weather App - Hiking Features

## Trail Score System

A 0-100 score optimized for hiking/backpacking trip planning.

### Score Calculation

| Component | Points | Ideal Condition |
|-----------|--------|-----------------|
| Temperature | 0-50 | 45-70°F average |
| Precipitation | 0-50 | 0% probability |

**Temperature Scoring:**

- Perfect (45-70°F avg): 50 pts
- Cool (35-45°F): 25-50 pts (linear scale)
- Warm (70-80°F): 25-50 pts (linear scale)
- Cold (<35°F): 0-25 pts
- Hot (>80°F): 0-25 pts

**Precipitation Scoring:**

- Linear: `50 * (1 - precipProb / 100)`

### Score Colors

| Score | Class | Color | Meaning |
|-------|-------|-------|---------|
| 80-100 | `score-excellent` | Green | Ideal hiking |
| 50-79 | `score-good` | Yellow | Good conditions |
| 25-49 | `score-fair` | Orange | Marginal |
| 0-24 | `score-poor` | Red | Poor conditions |

### Implementation

```typescript
// src/utils/icon.ts
trailScore(tempMax, tempMin, precipProb) → number (0-100)
trailScoreColor(score) → 'score-excellent' | 'score-good' | 'score-fair' | 'score-poor'
```

---

## Moon Phase Display

Maps API `moonphase` (0-1) to Weather Icons classes.

### Phase Mapping

| Phase Value | Icon | Name |
|-------------|------|------|
| 0, ~1 | `wi-moon-new` | New Moon |
| ~0.125 | `wi-moon-waxing-crescent-*` | Waxing Crescent |
| ~0.25 | `wi-moon-first-quarter` | First Quarter |
| ~0.375 | `wi-moon-waxing-gibbous-*` | Waxing Gibbous |
| ~0.5 | `wi-moon-full` | Full Moon |
| ~0.625 | `wi-moon-waning-gibbous-*` | Waning Gibbous |
| ~0.75 | `wi-moon-third-quarter` | Third Quarter |
| ~0.875 | `wi-moon-waning-crescent-*` | Waning Crescent |

### Implementation

```typescript
// src/utils/icon.ts
moonPhaseIcon(phase: number) → string (Weather Icons class)
```

---

## Cloud Coverage Display

Visual indicator combining icon opacity with percentage.

- Icon: `wi-cloudy` with opacity `0.3 + (cloudcover/100 * 0.7)`
- Shows percentage text alongside icon

---

## Component Structure

```
LocationDetail
├── TrailScoreCard (summary card above chart)
│   ├── Average score with progress bar
│   └── "Best Day" badge
├── LocationDetailChart (Recharts)
└── Forecast Table
    ├── Trail score column (colored badge per day)
    ├── Moon phase column (icon only)
    ├── Date, Details, H/L, Precip
    └── Cloud coverage (icon + %)
```

### Per-Day Trail Score

Each row shows a colored score badge:
- Green badge (80+): Excellent hiking day
- Yellow badge (50-79): Good conditions
- Orange badge (25-49): Fair conditions
- Red badge (0-24): Poor conditions

The best day row is highlighted with a green left border.

---

## Key Files

| File | Purpose |
|------|---------|
| `src/utils/icon.ts` | `moonPhaseIcon()`, `trailScore()`, `trailScoreColor()` |
| `src/components/weather/location_details/LocationDetail.tsx` | TrailScoreCard, table with hiking features |
| `src/components/weather/location_details/LocationDetail.scss` | Styles for score card, moon, indicators |

---

## Future Enhancements

- [ ] Multi-day trip planner tab
- [ ] Wind factor in trail score
- [ ] Elevation-adjusted forecasts
- [ ] Sunrise/sunset timeline
- [ ] Gear recommendations based on conditions
