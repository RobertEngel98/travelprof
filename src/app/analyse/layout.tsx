import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Travel Hacking Analyse – Finde dein perfektes Meilen-Setup | traveling.prof",
  description: "Kostenlose Analyse: In 2 Minuten dein perfektes Travel Hacking Setup finden. Kreditkarten, Meilenstrategie und Buchungs-Hacks passend zu deiner Lebenssituation.",
  keywords: ["Travel Hacking Analyse","Meilen Setup","Kreditkarten Vergleich Reisen","Amex Punkte Strategie","Meilenrechner"],
  openGraph: { title: "Dein perfektes Travel Hacking Setup in 2 Minuten", description: "Kostenlose Analyse: Finde heraus, wie viele Meilen du sammeln kannst." },
};

export default function AnalyseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
