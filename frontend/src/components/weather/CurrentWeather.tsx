"use client";

import Image from "next/image";
import { useWeather } from "../providers/WeatherProvider";
import useIsMobile from "@/src/hooks/useIsMobile";

export default function CurrentWeather() {
  const { weather: currentWeather, loading } = useWeather();

  const isMobile = useIsMobile();

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

  if (isMobile) {
    return (
      <div className="w-full flex flex-row items-center justify-center gap-2">
        <>
          <p>
            {currentWeather?.currentConditions?.temp}
            {currentWeather?.selectedUnit}°
          </p>
          <Image
            className="w-8 h-8"
            title={currentWeather?.currentConditions?.icon}
            src={`icons/weather/${currentWeather?.currentConditions?.icon}.svg`}
            alt={currentWeather?.currentConditions?.icon || "weather icon"}
            width={32}
            height={32}
          />
        </>
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
        <Image
          className="w-10 h-10"
          title={currentWeather?.currentConditions?.icon}
          src={`icons/weather/${currentWeather?.currentConditions?.icon}.svg`}
          alt={currentWeather?.currentConditions?.icon || "weather icon"}
          width={40}
          height={40}
        />
      </>
    </div>
  );
}
