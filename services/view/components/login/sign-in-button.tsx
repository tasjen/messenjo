import { Button } from "../ui/button";
import Image from "next/image";

type Props = {
  provider: string;
};

// use <a> instead of <Link> as it showed a weird
// failed fetch request in the network tab of dev tools

export default function LoginButton({ provider }: Props) {
  return (
    <a href={`/api/auth/login/${provider.toLowerCase()}`}>
      <Button>
        <Image
          priority
          width={20}
          height={20}
          className="pr-2"
          src={`/${provider.toLowerCase()}.svg`}
          alt="google logo"
        />
        Sign in with {provider}
      </Button>
    </a>
  );
}
