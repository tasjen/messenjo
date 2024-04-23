import { verifyUser } from "@/lib/actions";
import { cookies } from "next/headers";

export default async function UserInfo() {
  const user = await verifyUser(cookies());
  return (
    <>
      <div>provider_id: {user.providerId}</div>
      <div>provider_name: {user.providerName}</div>
    </>
  );
}
