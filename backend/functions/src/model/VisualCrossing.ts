// Types for Visual Crossing weather API responses.

export type VisualCrossingResponse = {
  latitude: number;
  longitude: number;
  resolvedAddress: string;
  address: string;
  timezone: string;
  tzoffset: number;
  description?: string;
  days: VisualCrossingDay[];
  alerts: VisualCrossingAlert[];
  stations: Record<string, VisualCrossingStation>;
  currentConditions: VisualCrossingCurrentConditions | null;
  city?: string;
  region?: string;
  country?: string;
};

export type VisualCrossingDay = {
  // ISO date or formatted date string (e.g. "2025-11-04")
  datetime: string;
  // optional unix epoch
  datetimeEpoch?: number;
  // temperature fields (may be named differently depending on API options)
  temp?: number;
  tempmax?: number;
  tempmin?: number;
  // precipitation
  precip?: number;
  precipprob?: number;
  preciptype?: string[];
  // textual conditions
  description?: string;
  // hourly breakdown (kept as any[] for flexibility)
  hours?: any[];
  // any additional fields returned by the API
  [key: string]: unknown;
};

export type VisualCrossingAlert = {
  title?: string;
  regions?: string[];
  severity?: string;
  urgency?: string;
  description?: string;
  effective?: string;
  expires?: string;
  [key: string]: unknown;
};

export type VisualCrossingStation = {
  id?: string;
  name?: string;
  latitude?: number;
  longitude?: number;
  elevation?: number;
  // latest observations (if provided)
  temp?: number;
  humidity?: number;
  winddir?: number;
  windgust?: number;
  windspeed?: number;
  [key: string]: unknown;
};

export type VisualCrossingCurrentConditions = {
  datetime?: string;
  datetimeEpoch?: number;
  temp?: number;
  feelslike?: number;
  humidity?: number;
  dew?: number;
  precip?: number;
  preciptype?: string[];
  snow?: number;
  snowdepth?: number;
  visibility?: number;
  cloudcover?: number;
  icon?: string;
  conditions?: string;
  winddir?: number;
  windgust?: number;
  windspeed?: number;
  sunrise?: string;
  sunset?: string;
  [key: string]: unknown;
};

export type CurrentWeatherResponse = {
  latitude: number;
  longitude: number;
  timezone: string;
  tzoffset: number;
  description: string;
  alerts: VisualCrossingAlert[];
  currentConditions: VisualCrossingCurrentConditions;
  city: string;
  region: string;
  country: string;
  selectedUnit: "C" | "F";
};
