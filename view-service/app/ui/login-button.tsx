"use client";

type Props = {
  provider: string;
};

export default function Login({ provider }: Props) {
  return (
    <button
      onClick={() => {
        window.location.href = `http://localhost:3000/api/auth/login/${provider}`;
      }}
    >
      login {provider}
    </button>
  );
}
