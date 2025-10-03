export type CityKeyResponse = {
  Key: string;
  Type: string;
  LocalizedName: string;
  TimeZone: {
    Code: string;
    Name: string;
  };
};

export type CurrentWeatherResponse = {
  LocalObservationDateTime: string;
  EpochTime: number;
  WeatherText: string;
  WeatherIcon: number; // this is an icon code
  HasPrecipitation: boolean;
  PrecipitationType: string | null;
  IsDayTime: boolean;
  Temperature: {
    Metric: {
      Value: number;
      Unit: string;
      UnitType: number;
    };
    Imperial: {
      Value: number;
      Unit: string;
      UnitType: number;
    };
  };
  MobileLink: string;
  Link: string;
};
