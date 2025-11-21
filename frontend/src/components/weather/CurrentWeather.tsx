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

  if (!currentWeather) {
    return (
      <div className="w-full flex flex-row items-center justify-center gap-4">
        <p>No weather data available.</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-row items-center justify-center gap-4">
      <>
        <p data-testid="cypress-currentweather-datetime">
          {currentWeather?.currentConditions?.datetimeEpoch &&
            new Date(
              currentWeather?.currentConditions?.datetimeEpoch * 1000
            ).toLocaleString()}
        </p>
        <p data-testid="cypress-currentweather-location">
          {currentWeather?.city}, {currentWeather?.region}
        </p>
        <p data-testid="cypress-currentweather-temp">
          {currentWeather?.currentConditions?.temp}
          {currentWeather?.selectedUnit}°
        </p>
        <img
          className="w-10 h-10"
          title={currentWeather?.currentConditions?.icon}
          src={`icons/weather/${currentWeather?.currentConditions?.icon}.svg`}
          alt={currentWeather?.currentConditions?.icon}
        />
      </>
    </div>
  );
}
