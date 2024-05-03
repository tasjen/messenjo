import { getUserId } from "@/lib/data";

export default async function HomePage() {
  const userId = getUserId();
  return (
    <>
      <div>Logged in</div>
      <div>userId: {userId.toString()}</div>
    </>
  );
}
