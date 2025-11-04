import UserProvider from "@/components/UserProvider";

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
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
