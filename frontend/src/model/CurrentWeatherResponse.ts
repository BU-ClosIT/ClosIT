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
