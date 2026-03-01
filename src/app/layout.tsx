import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "traveling.prof – Business Class zum Economy-Preis | Meilen & Travel Hacks",
  description:
    "Lerne mit @traveling.prof wie du mit Meilen, Punkten & cleveren Buchungstricks günstiger in der Business Class fliegst, Lounges nutzt und Traumhotels buchst. DACH-Raum.",
  keywords: [
    "Travel Hacks", "Meilen sammeln", "Business Class günstig", "Meilenprogramme",
    "Amex Punkte", "Miles and More", "Payback Meilen", "Lounge Zugang",
    "Kreditkarten Reisen", "Prämienflüge buchen", "Travel Hacking Deutschland",
    "Luxusreisen günstig", "Upgrade Strategien", "traveling.prof",
  ],
  authors: [{ name: "traveling.prof" }],
  creator: "traveling.prof",
  publisher: "traveling.prof",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://travelingprof.de",
    siteName: "traveling.prof",
    title: "traveling.prof – Business Class zum Economy-Preis",
    description: "Meilen & Travel Hacks für den DACH-Raum. Lerne, wie du smarter reist.",
  },
  twitter: {
    card: "summary_large_image",
    title: "traveling.prof – Meilen & Travel Hacks",
    description: "Business Class zum Economy-Preis. Meilen sammeln, Lounges nutzen, smarter reisen.",
  },
  alternates: { canonical: "https://travelingprof.de" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "traveling.prof",
    url: "https://travelingprof.de",
    sameAs: ["https://www.instagram.com/traveling.prof"],
    jobTitle: "Travel Hacking Expert",
    description: "Experte für Meilen, Punkte & clevere Buchungsstrategien im DACH-Raum.",
  };

  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&family=Playfair+Display:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
