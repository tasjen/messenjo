import { session } from "@/lib/utils";
import { headers } from "next/headers";

export default async function HomePage() {
  const userId = session(headers());
  return (
    <>
      <div>Logged in</div>
      <div>userId: {userId.toString()}</div>
    </>
  );
}
