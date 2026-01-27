import '../../../css/weather-icons.css';
import type { DailyForecastInterface } from '../../../interfaces/DailyForecastInterface';
import iconClass from '../../../utils/icon';

function aqiColor(aqi: number | undefined): string {
  if (!aqi || aqi <= 0) return '#4ade80'; // Default to green for invalid/missing data
  if (aqi <= 50) return '#4ade80'; // Good - Green
  if (aqi <= 100) return '#facc15'; // Moderate - Yellow
  if (aqi <= 150) return '#fb923c'; // Unhealthy for Sensitive Groups - Orange
  return '#ef4444'; // Unhealthy - Red
}

function WeatherIcon(props: DailyForecastInterface) {
  let icon = 'wi';
  const forecast = props;

  if (forecast.icon) {
    icon = iconClass(
      forecast.icon,
      forecast.precip,
      forecast.cloudcover,
      forecast.tempmax,
    );
  }

  // Check if AQI data is valid (present and greater than 0)
  const hasValidAqi = forecast.aqius && forecast.aqius > 0;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <i className={icon} title={forecast.description} />
      {hasValidAqi && (
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: aqiColor(forecast.aqius),
          }}
          title={`AQI: ${forecast.aqius}`}
        />
      )}
    </div>
  );
}

export default WeatherIcon;
