import HomeButton from "@/components/login/home-button";
import GoogleLoginButton from "@/components/login/google-login-button";
import GitHubLoginButton from "@/components/login/github-login-button";

export default function LoginPage() {
  return (
    <main className="flex flex-col h-screen justify-center items-center gap-4">
      <GoogleLoginButton />
      <GitHubLoginButton />
      <HomeButton />
    </main>
  );
}
