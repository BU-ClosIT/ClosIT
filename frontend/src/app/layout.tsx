import UserProvider from "../components/providers/UserProvider";
import WeatherProvider from "../components/providers/WeatherProvider";
import "./globals.css";

export const metadata = {
  title: "ClosIT",
  description: "ClosIt- Your Virtual Outfit Assitant",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WeatherProvider>
          <UserProvider>{children}</UserProvider>
        </WeatherProvider>
      </body>
    </html>
  );
}
