"use client";

import { useEffect, useState, useRef } from "react";
import { useUserReady } from "../providers/UserProvider";
import Loader from "../shared/Loader";
import { useWeather } from "../providers/WeatherProvider";
import { ClosetItemCard } from "./ClosetItemCard";
import {
  Recommendation,
  useRecommendation,
} from "../providers/RecommendationProvider";

export default function RecommendationCard() {
  const [currentWeatherRecArr, setCurrentWeatherRecArr] = useState<string[]>(
    []
  );
  const [recResponse, setRecResponse] = useState<Recommendation>();
  const currentWeather = useWeather();
  const isUserReady = useUserReady();
  const recommendation = useRecommendation();

  const {
    recommendation: rec,
    isLoading: isRecLoading,
    refreshRecommendation,
    setContext,
    setPreferences,
    getRec,
  } = recommendation;

  const typeRec = () => {
    const respArr = rec.content.split("");

    respArr.forEach((letter, idx) => {
      setTimeout(() => {
        setCurrentWeatherRecArr((prev) => [...prev, letter]);
      }, idx * 5);
    });
  };
  useEffect(() => {
    typeRec();
  }, [rec]);

  useEffect(() => {
    if (!isUserReady) return;
    (async () => {
      try {
        const resp = await getRec();
        console.log("Called getRec from useEffect:", resp);
        setRecResponse(resp);
        console.log("recResponse set to:", resp);
      } catch (err) {
        console.error("Error calling getRec from useEffect:", err);
      }
    })();
  }, [isUserReady, getRec, currentWeather]);

  const handleTryAgain = async () => {
    const previous = currentWeatherRecArr.join("");
    setPreferences(
      'Previous recommendation was: "' +
        previous +
        '". Please provide a new recommendation.'
    );
    setCurrentWeatherRecArr([]);
    await refreshRecommendation();
  };

  return (
    <div className="flex flex-col w-full min-h-[200px] bg-white p-4 border rounded-lg shadow-lg my-4 justify-center align-middle max-h-screen">
      {isRecLoading ? (
        <Loader />
      ) : (
        <div>
          <div className="whitespace-pre-wrap mb-4 italic">
            {currentWeatherRecArr.length ? currentWeatherRecArr.join("") : ""}
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            {recResponse?.outfit.map((item) => (
              <ClosetItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <button
          className="w-40 bg-blue-500 text-white px-4 py-2 rounded mt-4 justify-center align-middle hover:bg-blue-600 transition-colors"
          onClick={() => handleTryAgain()}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
