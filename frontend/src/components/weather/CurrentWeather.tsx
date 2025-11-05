"use client";

import { useWeather } from "../providers/WeatherProvider";

export default function CurrentWeather() {
  const { weather: currentWeather, loading } = useWeather();

  if (loading) {
    return (
      <div className="w-full flex flex-row items-center justify-center gap-4">
        <p>Loading weather...</p>
      </div>
    );
  }

  if (!currentWeather) return null;

  return (
    <div className="w-full flex flex-row items-center justify-center gap-4">
      <>
        <p>
          {new Date(currentWeather?.LocalObservationDateTime).toLocaleString()}
        </p>
        <p>
          {currentWeather.city}, {currentWeather.adminArea.ID}
        </p>
        <p>
          {currentWeather.Temperature.Imperial.Value}
          {currentWeather.Temperature.Imperial.Unit}°
        </p>
        <p>{currentWeather.WeatherText}</p>
      </>
    </div>
  );
}
