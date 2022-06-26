import AlertInterface from './AlertInterface';
import { DailyForecastInterface } from './DailyForecastInterface';

interface ForecastInterface {
    latitude: number;
    longitude: number;
    description: string;
    days: DailyForecastInterface[];
    alerts: AlertInterface[];
}

export default ForecastInterface;