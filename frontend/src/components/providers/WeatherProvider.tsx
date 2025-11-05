"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { CurrentWeatherResponse } from "@/src/model/CurrentWeatherResponse";
import { FirebaseServices } from "@/src/services/firebase-services";

type WeatherContext = {
  weather: CurrentWeatherResponse | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const WeatherContext = createContext<WeatherContext>({
  weather: null,
  loading: true,
  error: null,
  refresh: async () => {},
});

export default function WeatherProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [weather, setWeather] = useState<CurrentWeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await FirebaseServices.getCurrentWeather();
      setWeather(resp);
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const refresh = useCallback(async () => {
    await fetchWeather();
  }, [fetchWeather]);

  return (
    <WeatherContext.Provider value={{ weather, loading, error, refresh }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  return useContext(WeatherContext);
}
