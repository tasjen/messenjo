import { fetchUserByUsername } from "@/lib/data";
import { Button } from "../ui/button";
import { addFriend } from "@/lib/actions";

type Props = {
  username?: string;
};

export default async function FriendSearchResult({ username }: Props) {
  if (!username) {
    return <></>;
  }

  const userResult = await fetchUserByUsername(username);

  if (!userResult.id) {
    return <div>Username not found</div>;
  }

  return (
    <>
      <div>{username}</div>
      <form
        action={async () => {
          "use server";
          await addFriend(userResult.id);
        }}
      >
        <Button>Add</Button>
      </form>
    </>
  );
}
