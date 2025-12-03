"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useUser, useUserReady } from "./UserProvider";
import { useWeatherReady, useWeather } from "./WeatherProvider";
import { FirebaseServices } from "../../services/firebase-services";
import ClosetItem from "../../model/closet/ClosetItem";

type RecommendationContextType = {
  recommendation: Recommendation;
  isLoading: boolean;
  refreshRecommendation: () => Promise<void>;
  setContext: (context: string) => void;
  setPreferences: (preferences: string) => void;
  getRec: () => Promise<Recommendation | undefined>;
};

export type Recommendation = { content: string; outfit: ClosetItem[] };

const RecommendationContext = createContext<RecommendationContextType>({
  recommendation: { content: "", outfit: [] as ClosetItem[] },
  isLoading: true,
  refreshRecommendation: async () => {},
  setContext: (context: string) => {},
  setPreferences: (preferences: string) => {},
  getRec: async () => {
    return undefined;
  },
});

export const RecommendationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [recommendation, setRecommendation] = useState<Recommendation>({
    content: "",
    outfit: [] as ClosetItem[],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [context, setContext] = useState<string>("");
  const [preferences, setPreferences] = useState<string>("");

  const user = useUser();
  const isReady = useUserReady();
  const currentWeather = useWeather();
  const weatherReady = useWeatherReady();
  const hasMadeRecCallRef = useRef(false);

  const weatherReadyPromise = new Promise((resolve) => {
    if (weatherReady) {
      resolve(true);
    } else {
      const interval = setInterval(() => {
        if (weatherReady) {
          clearInterval(interval);
          resolve(true);
        }
      }, 100);
    }
  });

  const getRec = useCallback(async () => {
    await weatherReadyPromise;

    // early returns to prevent multiple calls and loading before ready
    if (!isReady || hasMadeRecCallRef.current) {
      return;
    }

    try {
      hasMadeRecCallRef.current = true;
      console.log({ context });
      const response: { content: string; outfit: ClosetItem[] } =
        await FirebaseServices.getRecommendation({
          userId: user ? user.id : "",
          userPreferences: preferences,
          context,
          currentWeather: JSON.stringify(currentWeather),
        });
      setIsLoading(false);

      console.log("Recommendation response:", response);
      setRecommendation({
        content: response.content,
        outfit: response.outfit,
      });
      return { content: response.content, outfit: response.outfit };
    } catch (error) {
      console.error("Error fetching recommendation:", error);
      setIsLoading(false);
    }
  }, [user, setIsLoading, isReady, currentWeather]);

  useEffect(() => {
    getRec();
  }, [getRec]);

  const refreshRecommendation = useCallback(async () => {
    hasMadeRecCallRef.current = false;
    setIsLoading(true);

    try {
      await getRec();
    } catch (err) {
      console.error("Error on Refresh:", err);
      setIsLoading(false);
    }
  }, [getRec]);

  return (
    <RecommendationContext.Provider
      value={{
        recommendation,
        isLoading,
        refreshRecommendation,
        setContext,
        setPreferences,
        getRec,
      }}
    >
      {children}
    </RecommendationContext.Provider>
  );
};

export function useRecommendation() {
  return useContext(RecommendationContext);
}
