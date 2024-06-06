import { Button } from "@/components/ui/button";
import { MessageCirclePlus } from "lucide-react";
import Link from "next/link";

export default function AddContactButton() {
  return (
    <Link href="/chat/new">
      <Button variant="secondary">
        <MessageCirclePlus />
      </Button>
    </Link>
  );
}
