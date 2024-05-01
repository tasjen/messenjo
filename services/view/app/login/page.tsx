import HomeButton from "@/components/login/home-button";
import SignInButton from "@/components/login/sign-in-button";

export default function LoginPage() {
  return (
    <main className="flex flex-col h-screen justify-center items-center gap-4">
      <SignInButton provider="google" />
      <SignInButton provider="github" />
      <HomeButton />
    </main>
  );
}
