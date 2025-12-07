"use client";

import { useEffect, useState } from "react";
import { useUser, useUserReady } from "../providers/UserProvider";
import Loader from "../shared/Loader";
import { useWeather } from "../providers/WeatherProvider";
import { ClosetItemCard } from "./ClosetItemCard";
import {
  Recommendation,
  useRecommendation,
} from "../providers/RecommendationProvider";
import { useTyping } from "@/src/hooks/useTyping";
import AddOutfitModal from "../../components/closet-management/modals/AddOutfitModal"
import { FirebaseServices } from "../../../src/services/firebase-services";

export default function RecommendationCard() {
  const [recResponse, setRecResponse] = useState<Recommendation>();
  const currentWeather = useWeather();
  const user = useUser();
  const isUserReady = useUserReady();
  const recommendation = useRecommendation();
  const { typedArr: currentWeatherRecArr, setToType, clear } = useTyping();

  const {
    recommendation: rec,
    isLoading: isRecLoading,
    refreshRecommendation,
    setPreferences,
    getRec,
  } = recommendation;

  // Controls the AddOutfitModal
  const [isAddOutfitOpen, setAddOutfitOpen] = useState(false);

  // Extract item IDs from recommendation
  const itemIds = recResponse?.outfit.map((i) => i.id) ?? [];

  // Typewriter effect
  useEffect(() => {
    setToType(rec.content);
  }, [rec.content]);

  // Fetch recommendation when user + weather ready
  useEffect(() => {
    if (!isUserReady) return;
    (async () => {
      try {
        const resp = await getRec();
        setRecResponse(resp);
      } catch (err) {
        console.error("Error calling getRec from useEffect:", err);
      }
    })();
  }, [isUserReady, getRec, currentWeather]);

  const handleTryAgain = async () => {
    const previous = currentWeatherRecArr.join("");

    setPreferences(
      `Previous recommendation was: "${previous}". Please provide a new recommendation.`
    );

    clear();
    await refreshRecommendation();
  };

  const saveOutfit = async (outfit: any) => {
    if (!user) {
      console.error("User not found in context");
      return;
    }

    await FirebaseServices.setOutfitInCloset({
      userId: user.id,
      outfit,
    });
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
          className="w-40 bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600 transition-colors"
          onClick={handleTryAgain}
        >
          Try Again
        </button>
      </div>

      <div className="flex justify-center mt-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          onClick={() => setAddOutfitOpen(true)}
        >
          Save as Outfit
        </button>
      </div>

      <AddOutfitModal
        isOpen={isAddOutfitOpen}
        onClose={() => setAddOutfitOpen(false)}
        defaultItemIds={itemIds}
        saveOutfit={saveOutfit}
      />
    </div>
  );
}
