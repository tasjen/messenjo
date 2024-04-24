import env from "@/lib/env";
import Chat from "./ui/chatbox";
import LogoutButton from "./ui/logout-button";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export default async function Home() {
  const userId = await verifyToken(cookies());
  return (
    <main>
      <div>Logged in</div>
      <div>{userId}</div>
      <Chat host={env.HOST} />
      <LogoutButton />
    </main>
  );
}
