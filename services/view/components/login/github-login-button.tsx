import { Button } from "../ui/button";
import Image from "next/image";

// use <a> instead of <Link> as it showed a weird
// failed fetch request in the network tab of dev tools

export default function GitHubLoginButton() {
  return (
    <a href={"/api/auth/login/github"}>
      <Button>
        <Image
          priority
          width={20}
          height={20}
          className="pr-2"
          src="/github.svg"
          alt="github logo"
        />
        Sign in with GitHub
      </Button>
    </a>
  );
}
