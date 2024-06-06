import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";

export default function HomeButton() {
  return (
    <Link href="/">
      <Button variant="secondary">
        <Home />
      </Button>
    </Link>
  );
}
