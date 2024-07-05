import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icon";

// use <a> instead of <Link> for sign in button to avoid making
// unknown failed fetch request in the network tab of dev tools

export default function LoginPage() {
  return (
    <main className="flex flex-col h-screen justify-center items-center gap-4">
      <a href="/api/auth/login/google">
        <Button>
          <Icons.google className="inline w-4 h-4 mr-2" />
          <span>Continue with Google</span>
        </Button>
      </a>
      <a href="/api/auth/login/github">
        <Button>
          <Icons.gitHub className="inline w-4 h-4 mr-2" />
          <span>Continue with GitHub</span>
        </Button>
      </a>
      <a href="/">
        <button>Home</button>
      </a>
    </main>
  );
}
