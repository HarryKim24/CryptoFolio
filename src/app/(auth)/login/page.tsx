"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const router = useRouter();

  const triggerError = (message: string) => {
    setError("");
    setShake(false);
    requestAnimationFrame(() => {
      setError(message);
      setShake(true);
    });
  };

  const handleLogin = async () => {
    if (!email || !password) {
      triggerError("이메일과 비밀번호를 모두 입력하세요.");
      return;
    }

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push("/portfolio");
    } else {
      triggerError("이메일 또는 비밀번호가 틀렸습니다.");
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-neutral-100 mb-2 text-center">
        로그인
      </h1>

      <div className="h-5 mb-4 text-center">
        <p
          className={`text-red-400 text-sm transition-all duration-300 ease-out ${
            error ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
          } ${shake ? "shake" : ""}`}
        >
          {error || "‎"}
        </p>
      </div>

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