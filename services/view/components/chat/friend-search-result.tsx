import { fetchUserByUsername } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { addFriend } from "@/lib/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  username?: string;
};

export default async function FriendSearchResult({ username }: Props) {
  if (!username) {
    return <></>;
  }

  const userResult = await fetchUserByUsername(username);

  if (!userResult) {
    return <div>Username not found</div>;
  }
  console.log(userResult.pfp);
  return (
    <div className="mt-4 flex flex-col items-center">
      <Avatar className="self-center h-36 w-36 mb-4">
        <AvatarImage src={userResult.pfp} alt={`${userResult.pfp}'s pfp`} />
        <AvatarFallback>{userResult.username[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="text-xl mb-2">{username}</div>
      <form
        action={async () => {
          "use server";
          await addFriend(userResult.id);
        }}
      >
        <Button>Add</Button>
      </form>
    </div>
  );
}
