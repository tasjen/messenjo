import { Button } from "@/components/ui/button";
import { UserRoundPlus } from "lucide-react";
import Link from "next/link";

export default function FriendButton() {
  return (
    <Link href="/friends">
      <Button size="icon" variant="secondary">
        <UserRoundPlus className="h-6 w-6" />
      </Button>
    </Link>
  );
}
