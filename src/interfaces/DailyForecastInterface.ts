interface DailyForecastInterface {
    datetime: string;
    tempmax: number;
    tempmin: number;
    precip: number;
    precipprob: number;
    precipcover?: number;
    cloudcover: number;
    sunrise: string;
    sunset: string;
    moonphase: number;
    conditions: string;
    description: string;
    icon: string;
}

export default DailyForecastInterface;
