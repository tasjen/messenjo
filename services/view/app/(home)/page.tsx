import HomePageClient from "@/components/home-page-client";
import { getUserInfo } from "@/lib/store/server";

export default async function HomePage() {
  const user = await getUserInfo();
  return <HomePageClient user={user} />;
}
