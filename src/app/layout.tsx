import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "traveling.prof – Travel Hacks, Meilen & Luxusreisen",
  description:
    "Travel Hacks, Meilen-Strategien, Lounge-Insider & Luxusreisen mit traveling.prof. Lerne, wie du smarter buchst, günstiger fliegst und mehr aus deinen Reisen herausholst.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
