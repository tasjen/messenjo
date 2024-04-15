import env from "@/lib/env";
import Chat from "./ui/chatbox";
import UserInfo from "./ui/user-info";

export default function Home() {
  return (
    <main>
      <UserInfo />
      <Chat host={env.HOST} />
    </main>
  );
}
