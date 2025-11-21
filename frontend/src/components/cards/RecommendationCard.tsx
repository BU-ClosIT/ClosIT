"use client";

import { FirebaseServices } from "../../services/firebase-services";
import { useEffect, useState, useCallback, useRef } from "react";
import { useUser, useUserReady } from "../providers/UserProvider";
import Loader from "../shared/Loader";
import { useWeather } from "../providers/WeatherProvider";
import ClosetItem from "@/src/model/closet/ClosetItem";
import { ClosetItemCard } from "./ClosetItemCard";

export default function RecommendationCard() {
  const [currentWeatherRecArr, setCurrentWeatherRecArr] = useState<string[]>(
    []
  );
  const [recResponse, setRecResponse] = useState<{
    content: string;
    outfit: ClosetItem[];
  }>();
  const currentWeather = useWeather();
  const [isLoading, setIsLoading] = useState(true);
  const user = useUser();
  const isReady = useUserReady();
  // hasMadeRecCall to prevent multiple calls
  const hasMadeRecCallRef = useRef(false);

  const getRec = useCallback(
    async ({
      preferences,
      context,
    }: {
      preferences?: string;
      context?: string;
    }) => {
      if (!isReady || hasMadeRecCallRef.current) return;
      try {
        hasMadeRecCallRef.current = true;
        const response: { content: string; outfit: ClosetItem[] } =
          await FirebaseServices.getRecommendation({
            userId: user ? user.id : "",
            userPreferences: preferences,
            context: {
              context,
              currentWeather: JSON.stringify(currentWeather),
            },
          });
        setIsLoading(false);
        console.log("Recommendation response:", response);
        setRecResponse(response);
        const respArr = response.content.split("");

        respArr.forEach((letter, idx) => {
          setTimeout(() => {
            setCurrentWeatherRecArr((prev) => [...prev, letter]);
          }, idx * 5);
        });
      } catch (error) {
        console.error("Error fetching recommendation:", error);
        setIsLoading(false);
      }
    },
    [user, setIsLoading, isReady, currentWeather]
  );

  useEffect(() => {
    console.log("useEffect triggered in RecommendationCard");
    if (!isReady) return;
    (async () => {
      try {
        await getRec({
          context: currentWeather ? JSON.stringify(currentWeather) : "",
        });
      } catch (err) {
        console.error("Error calling getRec from useEffect:", err);
        setIsLoading(false);
      }
    })();
  }, [isReady, getRec, currentWeather]);

  const handleTryAgain = async () => {
    const previous = currentWeatherRecArr.join("");
    setCurrentWeatherRecArr([]);
    setIsLoading(true);
    try {
      await getRec({
        preferences: "the following was your last suggestion, please try again",
        context: previous,
      });
    } catch (err) {
      console.error("Error on Try Again:", err);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-[200px] p-4 border rounded-lg shadow-lg my-4 justify-center align-middle max-h-screen">
      {isLoading && <Loader />}
      <div className="whitespace-pre-wrap mb-4 italic">
        {currentWeatherRecArr.length ? currentWeatherRecArr.join("") : ""}
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        {recResponse?.outfit.map((item) => (
          <ClosetItemCard key={item.id} item={item} />
        ))}
      </div>

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
