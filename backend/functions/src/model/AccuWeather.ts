export type CityKeyResponse = {
  Key: string;
  Type: string;
  LocalizedName: string;
  TimeZone: {
    Code: string;
    Name: string;
  };
  Region: {
    ID: string;
    LocalizedName: string;
    EnglishName: string;
  };
  EnglishName: string;
  Country: {
    ID: string;
    LocalizedName: string;
    EnglishName: string;
  };
  AdministrativeArea: {
    Level: number;
    LocalizedType: object;
    EnglishType: object;
    CountryID: string;
    ID: string;
    LocalizedName: string;
    EnglishName: string;
  };
  SupplementalAdminAreas: [
    {
      Level: number;
      LocalizedName: string;
      EnglishName: string;
    }
  ];
};

// Theres a lot more to these responses that might make sense to send to Gemini for more detailed recomendations
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
