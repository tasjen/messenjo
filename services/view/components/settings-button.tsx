import { Settings } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function SettingsButton() {
  return (
    <Link href="/settings">
      <Button size="icon" variant="secondary">
        <Settings className="h-6 w-6" />
      </Button>
    </Link>
  );
}
