import { DailyForecastInterface } from './DailyForecastInterface';

interface ForecastInterface {
    latitude: number;
    longitude: number;
    description: string;
    days: DailyForecastInterface[];
}

export default ForecastInterface;
