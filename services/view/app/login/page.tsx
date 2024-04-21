import HomeButton from "../ui/home-button";
import LoginButton from "../ui/login-button";

export default function LoginPage() {
  return (
    <>
      <LoginButton provider="google" />
      <LoginButton provider="github" />
      <HomeButton />
    </>
  );
}
