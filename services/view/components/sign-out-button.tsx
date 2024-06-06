// use <a> instead of <Link> as clicking <Link> doesn't revalidate the "/" path
// allowing users to navigate back to the cached home page
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SignOutButton() {
  return (
    <a href="/api/auth/logout">
      <Button variant="secondary">
        <LogOut />
      </Button>
    </a>
  );
}
