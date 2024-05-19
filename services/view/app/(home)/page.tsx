import NoSSR from "@/components/no-ssr";
import { ThemeSwitch } from "@/components/theme-switch";
import Username from "@/components/username";
import { getUserId } from "@/lib/data";

export default async function HomePage() {
  const userId = getUserId();
  return (
    <>
      <div>Logged in</div>
      <div>
        username: <Username />
      </div>
      <div>userId: {userId.toString()}</div>
      <NoSSR>
        <ThemeSwitch />
      </NoSSR>
    </>
  );
}
