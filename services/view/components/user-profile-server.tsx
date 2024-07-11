import { getUserInfo } from "@/lib/store/server";
import UserProfileClient from "./user-profile-client";

export default async function UserProfileServer() {
  const user = await getUserInfo();
  return <UserProfileClient user={user} />;
}
