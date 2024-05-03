import { fetchUserByUsername } from "@/lib/data";
import { Button } from "../ui/button";
import { uuidFormat } from "@/lib/utils";
import { addFriend } from "@/lib/actions";

type Props = {
  username?: string;
};

export default async function Result({ username }: Props) {
  if (!username) {
    return <></>;
  }

  const userResult = await fetchUserByUsername(username);

  return (
    <>
      <div>{uuidFormat(userResult.id)}</div>
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
