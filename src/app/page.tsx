import { getCmsData } from "@/lib/cms";
import LandingPage from "./LandingPage";

export default async function Home() {
  const cms = await getCmsData();
  return <LandingPage cms={cms} />;
}
