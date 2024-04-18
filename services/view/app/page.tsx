import env from "@/lib/env";
import Chat from "./ui/chatbox";
import UserInfo from "./ui/user-info";
import LogoutButton from "./ui/logout-button";

export default async function Home() {
  return (
    <main>
      <UserInfo />
      <Chat host={env.HOST} />
      <LogoutButton />
    </main>
  );
}
