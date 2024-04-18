"use client";

type Props = {
  host: string;
  provider: string;
};

export default function LoginButton({ host, provider }: Props) {
  return (
    <>
      <a href={`http://${host}/api/auth/login/${provider}`}>
        <button>login {provider}</button>
      </a>
    </>
  );
}
