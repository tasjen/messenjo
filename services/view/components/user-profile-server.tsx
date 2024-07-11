import { getContacts, getUserInfo } from "@/lib/store/server";
import UserProfileClient from "./user-profile-client";

export default async function UserProfileServer() {
  const [user, contacts] = await Promise.all([getUserInfo(), getContacts()]);

  return <UserProfileClient user={user} contacts={contacts} />;
}
