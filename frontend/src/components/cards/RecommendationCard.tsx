"use client";

import { FirebaseServices } from "../../services/firebase-services";
import { useEffect, useState, useCallback } from "react";
import { useUser, useUserReady } from "../providers/UserProvider";
import Loader from "../shared/Loader";
import { useWeather } from "../providers/WeatherProvider";

export default function RecommendationCard() {
  const [currentWeatherRec, setCurrentWeatherRec] = useState<string[]>([]);
  const currentWeather = useWeather();
  const [isLoading, setIsLoading] = useState(true);
  const user = useUser();
  const isReady = useUserReady();

  const getRec = useCallback(
    async ({
      preferences,
      context,
    }: {
      preferences?: string;
      context?: string;
    }) => {
      if (!isReady) return;
      const response: { content: string; outfit: string[] } =
        await FirebaseServices.getRecommendation({
          userId: user ? user.id : "",
          userPreferences: preferences,
          context: { context, currentWeather: JSON.stringify(currentWeather) },
        });
      setIsLoading(false);
      const respArr = response.content.split("");

      respArr.forEach((letter, idx) => {
        setTimeout(() => {
          setCurrentWeatherRec((prev) => [...prev, letter]);
        }, idx * 5);
      });
    },
    [user?.id, setIsLoading]
  );

  useEffect(() => {
    console.log("useEffect triggered in RecommendationCard");
    if (!isReady) return;
    getRec({ context: currentWeather ? JSON.stringify(currentWeather) : "" });
  }, [isReady, getRec]);

  const handleTryAgain = () => {
    const previous = currentWeatherRec.join("");
    setCurrentWeatherRec([]);
    setIsLoading(true);
    getRec({
      preferences: "the following was your last suggestion, please try again",
      context: previous,
    });
  };

  return (
    <div className="flex flex-col w-full min-h-[200px] p-4 border rounded-lg shadow-lg my-4 justify-center max-h-screen">
      {isLoading && <Loader />}
      <div>{currentWeatherRec.length ? currentWeatherRec.join("") : ""}</div>

      <div className="flex justify-center">
        <button
          className="w-40 bg-blue-500 text-white px-4 py-2 rounded mt-4 justify-center align-middle"
          onClick={() => handleTryAgain()}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
