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

interface WeatherIconProps extends DailyForecastInterface {
  showAqi: boolean;
}

function WeatherIcon(props: WeatherIconProps) {
  let icon = 'wi';
  const forecast = props;
  const { showAqi } = props;

  if (forecast.icon) {
    icon = iconClass(
      forecast.icon,
      forecast.precip,
      forecast.cloudcover,
      forecast.tempmax,
    );
  }

  // Check if AQI data is valid (present and greater than 0) and user wants to see it
  const hasValidAqi = forecast.aqius && forecast.aqius > 0;
  const shouldShowAqi = hasValidAqi && showAqi;

  // Debug logging (only log when AQI data exists)
  if (hasValidAqi && forecast.datetime) {
    console.log(`[WeatherIcon ${forecast.datetime}] showAqi=${showAqi}, aqius=${forecast.aqius}, shouldShowAqi=${shouldShowAqi}`);
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: shouldShowAqi ? '32px' : 'auto',
        height: shouldShowAqi ? '32px' : 'auto',
        boxShadow: shouldShowAqi ? `0 0 0 1px ${aqiColor(forecast.aqius)}` : 'none',
        borderRadius: '50%',
      }}
      title={hasValidAqi ? `${forecast.description} - AQI: ${forecast.aqius}` : forecast.description}
    >
      <i className={icon} />
    </div>
  );
}

export default WeatherIcon;
