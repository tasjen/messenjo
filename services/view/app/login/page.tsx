import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icon";

// use <a> instead of <Link> for sign in button to avoid making
// unknown failed fetch request in the network tab of dev tools

export default function LoginPage() {
  return (
    <main className="flex flex-col h-screen justify-center items-center gap-4">
      <div className="text-4xl mb-4">
        Messenjo v0.0.1
        <a href="https://github.com/tasjen/messenjo" target="_blank">
          <Icons.gitHub className="inline w-8 h-8 mb-2 ml-2" />
        </a>
      </div>
      <a href="/api/auth/login/google">
        <Button className="rounded-full px-6">
          <Icons.google className="inline w-4 h-4 mr-2" />
          <span>Continue with Google</span>
        </Button>
      </a>
      <a href="/api/auth/login/github">
        <Button className="rounded-full px-6">
          <Icons.gitHub className="inline w-4 h-4 mr-2" />
          <span>Continue with GitHub</span>
        </Button>
      </a>
    </main>
  );
}
