import LoginButton from "../ui/login-button";
import { env } from "process";

export default function LoginPage() {
  return (
    <>
      <LoginButton host={env.HOST} provider="google" />
      <LoginButton host={env.HOST} provider="github" />
    </>
  );
}
