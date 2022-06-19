const iconMapping: {[key: string] : string} = {
    'clear-day': 'day-sunny',
    'clear-night': 'night-clear',
    'rain': 'rain',
    'snow': 'snow',
    'sleet': 'sleet',
    'wind': 'strong-wind',
    'fog': 'fog',
    'cloudy': 'cloudy',
    'partly-cloudy-day': 'cloudy',
    'partly-cloudy-night': 'night-partly-cloudy',
    'hail': 'hail',
    'thunderstorm': 'thunderstorm',
    'tornado': 'tornado',
};

export function icon_class(icon: string, precipitation: number, cloud_cover: number, max_temp: number): string {
    let mapping = iconMapping[icon] || "na";
    let additional_class = "";

    if (mapping === "cloudy" || mapping === 'day-cloudy') {
        if (precipitation) {
            if(precipitation < 30) {
                additional_class = 'sunshine-10';
            } else if(precipitation < 60) {
                additional_class = 'sunshine-50';
            } else {
                additional_class = 'sunshine-100';
            }
        }

        // OVERRIDE sunshine color to greyish if cloud cover is high
        if (cloud_cover > 60) additional_class = "sunshine-50";

        // show a bit of sun peeking out if there is less than 50% cloud cover
        if (cloud_cover <= 50) mapping = "day-cloudy"
    } else if (mapping === "day-sunny" && max_temp >= 80) {
        mapping = "hot"
    }

    if (max_temp >= 90) {
        additional_class += " high-temp-wi-hotter"
    } else if (max_temp >= 80) {
        additional_class += " high-temp-wi-hot"
    }

    return "wi weather-icon wi-" + mapping + " " + mapping + " " + additional_class
}

export function precipitation(precipitation: number): string {
    precipitation = precipitation || 0;
    precipitation *= 100;
    if (precipitation > 100) precipitation /= 100;
    return `${Math.round(precipitation)}%`
}
  
export function precipitationAmount(p: number): string {
    if (p) {
        if (p === 0 || Math.round(p) === 0) return "-";
        return `${Math.round(p)}"`
    } else {
        return "-"
    }
}