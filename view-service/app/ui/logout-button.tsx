import { logout } from "@/lib/actions";
export default function Logout() {
  return (
    <form action={logout}>
      <button>logout</button>
    </form>
  );
}
