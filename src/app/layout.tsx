import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "traveling.prof – Travel Hacks, Meilen & Luxusreisen",
  description:
    "Travel Hacks, Meilen-Strategien, Lounge-Insider & Luxusreisen mit traveling.prof. Lerne, wie du smarter buchst, günstiger fliegst und mehr aus deinen Reisen herausholst.",
  openGraph: {
    title: "traveling.prof – Travel Hacks, Meilen & Luxusreisen",
    description:
      "Lerne, wie du smarter reist: Business Class, Lounges & Traumhotels zum schlauen Preis.",
    type: "website",
    locale: "de_DE",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
