// use <a> instead of <Link> as clicking <Link> doesn't revalidate the "/" path
// allowing users to navigate back to the cached home page

import { LogOut } from "lucide-react";
import { Button } from "./ui/button";

export default function LogoutButton() {
  return (
    <a href="/api/auth/logout">
      <Button size="icon" variant="secondary">
        <LogOut className="h-6 w-6" />
      </Button>
    </a>
  );
}
