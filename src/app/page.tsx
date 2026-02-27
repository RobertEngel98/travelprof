import { getCmsData } from "@/lib/cms-server";
import LandingPage from "./LandingPage";

export const dynamic = "force-dynamic";

export default async function Home() {
  const cms = await getCmsData();
  return <LandingPage cms={cms} />;
}
