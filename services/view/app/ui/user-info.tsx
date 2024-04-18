import { verifyUser } from "@/lib/actions";
import { cookies } from "next/headers";

export default async function UserInfo() {
  const user = await verifyUser(cookies());
  return (
    <>
      <div>id: {user.id}</div>
      <div>name: {user.name}</div>
    </>
  );
}
