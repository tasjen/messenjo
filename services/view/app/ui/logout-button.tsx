// use <a> instead of <Link> as clicking <Link> doesn't revalidate the "/" path
// allowing users to navigate back to the cached home page

export default function LogoutButton() {
  return (
    <a href="/api/auth/logout">
      <button>logout</button>
    </a>
  );
}
