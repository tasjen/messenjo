import { User } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";

export default function UserInfo() {
  const userHeader = z.string().parse(headers().get("user"));
  const user = User.parse(JSON.parse(userHeader));

  return (
    <>
      <div>id: {user.id}</div>
      <div>name: {user.name}</div>
    </>
  );
}
