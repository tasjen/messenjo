import NoSSR from "@/components/no-ssr";
import { ThemeSwitchSkeleton } from "@/components/skeletons/theme-switch";
import { ThemeSwitch } from "@/components/theme-switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserInfo } from "@/lib/stores/server-store";

export default async function HomePage() {
  const user = await getUserInfo();
  return (
    <>
      <div>Logged in</div>
      <Avatar className="self-center h-20 w-20">
        <AvatarImage src={user.pfp} alt="your pfp" />
        <AvatarFallback>{user.username[0]}</AvatarFallback>
      </Avatar>
      <div>username: {user.username}</div>
      <div>userId: {user.id}</div>
      <NoSSR fallback={<ThemeSwitchSkeleton />}>
        <ThemeSwitch />
      </NoSSR>
    </>
  );
}
