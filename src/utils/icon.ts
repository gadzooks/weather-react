const iconMapping: { [key: string]: string } = {
  "clear-day": "day-sunny",
  "clear-night": "night-clear",
  rain: "rain",
  snow: "snow",
  sleet: "sleet",
  wind: "strong-wind",
  fog: "fog",
  cloudy: "cloudy",
  "partly-cloudy-day": "cloudy",
  "partly-cloudy-night": "night-partly-cloudy",
  hail: "hail",
  thunderstorm: "thunderstorm",
  tornado: "tornado",
};

// eslint-disable-next-line max-len
export default function iconClass(
  icon: string,
  precip: number,
  cloudCover: number,
  maxTemp: number
): string {
  let mapping = iconMapping[icon] || "na";
  let additionalClass = "";

  if (mapping === "cloudy") {
    if (precip) {
      if (precip < 30) {
        additionalClass = "sunshine-10";
      } else if (precip < 60) {
        additionalClass = "sunshine-50";
      } else {
        additionalClass = "sunshine-100";
      }
    }

    // OVERRIDE sunshine color to greyish if cloud cover is high
    if (cloudCover > 60) additionalClass = "sunshine-50";

    // show a bit of sun peeking out if there is less than 50% cloud cover
    if (cloudCover <= 50) mapping = "day-cloudy";
  } else if (mapping === "day-sunny" && maxTemp >= 80) {
    mapping = "hot";
  }

  if (maxTemp >= 90) {
    additionalClass += " high-temp-wi-hotter";
  } else if (maxTemp >= 80) {
    additionalClass += " high-temp-wi-hot";
  }

  return `wi weather-icon wi-${mapping} ${mapping} ${additionalClass}`;
}

export function precipitation(precip: number): string {
  if (!precip) return "";

  let computedPrecip = precip * 100;
  if (computedPrecip > 100) computedPrecip /= 100;
  return `${Math.round(computedPrecip)}%`;
}

export function precipitationAmount(p: number): string {
  if (p) {
    if (p === 0 || Math.round(p) === 0) return "-";
    return `${Math.round(p)}"`;
  }
  return "-";
}
