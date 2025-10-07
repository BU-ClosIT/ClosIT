import Layout from "@/components/shared/layout";
import { FirebaseServices } from "@/services/firebase-services";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import styles from "../styles/dashboard.module.css";
import { CurrentWeatherResponse } from "@/model/CurrentWeatherResponse";

interface PageProps {
  slug?: string;
}

const DashboardPage: React.FC<PageProps> = ({ slug = "dashboard" }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentWeatherRec, setCurrentWeatherRec] = useState<string[]>([]);
  const [currentWeather, setCurrentWeather] =
    useState<CurrentWeatherResponse>();

  const getRec = async () => {
    const response = await FirebaseServices.getRecommendation({});
    setIsLoading(false);

    const respArr = response.split("");

    respArr.forEach((letter, idx) => {
      setTimeout(() => {
        setCurrentWeatherRec((prev) => [...prev, letter]);
      }, idx * 5);
    });
  };

  useEffect(() => {
    getRec();
  }, []);

  const getWeather = async () => {
    const response: CurrentWeatherResponse =
      await FirebaseServices.getCurrentWeather();
    console.log(response);
    setCurrentWeather(response);
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <Layout>
      <h1>Page: {slug}</h1>
      <div className={styles.recommendationCard}>
        <div className={styles.locationDetails}>
          {currentWeather && (
            <>
              <p>
                {new Date(
                  currentWeather?.LocalObservationDateTime
                ).toLocaleString()}
              </p>
              <p>
                {currentWeather.city}, {currentWeather.adminArea.ID}
              </p>
              <p>
                {currentWeather.Temperature.Imperial.Value}
                {currentWeather.Temperature.Imperial.Unit}°
              </p>
              <p>{currentWeather.WeatherText}</p>
            </>
          )}
        </div>

        {isLoading ? (
          <div className={styles.loader}></div>
        ) : (
          <p>{currentWeatherRec.length ? currentWeatherRec.join("") : ""}</p>
        )}
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Provide a stable slug prop so server-rendered markup matches client.
  return {
    props: {
      slug: "dashboard",
    },
  };
};

export default DashboardPage;
