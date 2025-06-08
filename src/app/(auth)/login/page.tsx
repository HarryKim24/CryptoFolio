"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push("/portfolio");
    } else {
      setError("이메일 또는 비밀번호가 틀렸습니다");
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-neutral-100 mb-8 text-center">
        로그인
      </h1>

      <div className="space-y-4">
        <div className="w-full rounded bg-second-gradient p-[1px]">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded bg-secondary text-white placeholder-pink-200 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div className="w-full rounded bg-second-gradient p-[1px]">
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded bg-secondary text-white placeholder-pink-200 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full py-2 px-4 bg-second-gradient text-secondary font-semibold rounded hover:brightness-105 transition"
        >
          로그인
        </button>
      </div>

      <div className="text-sm text-center text-neutral-100 mt-6">
        계정이 없으신가요?{" "}
        <Link href="/register" className="text-accent hover:underline">
          회원가입
        </Link>
      </div>
    </>
  );
};

export default LoginPage;