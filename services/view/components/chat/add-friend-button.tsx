"use client";

import { addFriend } from "@/lib/actions";
import { FriendContact, User } from "@/lib/schema";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/stores/client-store";

type Props = {
  user: User;
};

export default function AddFriendButton({ user }: Props) {
  const store = useStore();

  async function handleSubmit() {
    try {
      const groupId = await addFriend(user.id);
      store.addContact(
        FriendContact.parse({
          type: "friend",
          groupId,
          pfp: user.pfp,
          name: user.username,
          userId: user.id,
        })
      );
    } catch (err) {
      if (err instanceof Error) {
        toast(err.message);
      }
    }
  }

  return (
    <form action={handleSubmit}>
      <Button type="submit">Add</Button>
    </form>
  );
}
