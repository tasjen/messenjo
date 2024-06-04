import { fetchUserByUsername } from "@/lib/data";
import FriendSearchResultClient from "./friend-search-result-client";

type Props = {
  username?: string;
};

export default async function FriendSearchResultServer({ username }: Props) {
  if (!username) {
    return <></>;
  }

  const userResult = await fetchUserByUsername(username);
  if (!userResult) {
    return <div className="text-center">User not found</div>;
  }

  return <FriendSearchResultClient user={userResult} />;
}
