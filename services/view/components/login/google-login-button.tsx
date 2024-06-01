import { Button } from "@/components/ui/button";
import Image from "next/image";

// use <a> instead of <Link> as it showed a weird
// failed fetch request in the network tab of dev tools

export default function GoogleLoginButton() {
  return (
    <a href={"/api/auth/login/google"}>
      <Button>
        <Image
          priority
          width={20}
          height={20}
          className="pr-2"
          src="/google.svg"
          alt="google logo"
        />
        Sign in with Google
      </Button>
    </a>
  );
}
