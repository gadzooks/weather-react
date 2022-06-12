import { icon_class } from "./icon"

describe('icon_class', () => {
    it('should show mapping for clear-day', () => {
        const result = icon_class('clear-day', 0, 0, 0);
        expect(result).toStrictEqual('wi weather-icon wi-day-sunny day-sunny ');
    })

    it('should show mapping for cloudy', () => {
        const result = icon_class('cloudy', 10, 0, 0);
        expect(result).toStrictEqual('wi weather-icon wi-day-cloudy day-cloudy sunshine-10');
    })

    it('should show mapping for cloudy', () => {
        const result = icon_class('cloudy', 30, 0, 0);
        expect(result).toStrictEqual('wi weather-icon wi-day-cloudy day-cloudy sunshine-50');
    })

})