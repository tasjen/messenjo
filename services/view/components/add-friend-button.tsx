import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FriendLink() {
  return (
    <Link href="/friends">
      <Button>Friends</Button>
    </Link>
  );
}
