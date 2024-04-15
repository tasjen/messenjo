import { headers } from "next/headers";
import LoginButton from "../ui/login-button";
import Logout from "../ui/logout-button";

export default function LoginPage() {
  const user = headers().get("user");
  return (
    <>
      <LoginButton provider="google" />
      <LoginButton provider="github" />
      <Logout />
      <div>{user}</div>
    </>
  );
}
