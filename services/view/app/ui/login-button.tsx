type Props = {
  provider: string;
};

// use <a> instead of <Link> as it showed a weird
// failed fetch request in the network tab of dev tools

export default function LoginButton({ provider }: Props) {
  return (
    <a href={`/api/auth/login/${provider}`}>
      <button>login {provider}</button>
    </a>
  );
}
