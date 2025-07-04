"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      router.push("/");
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
          className={`text-warning text-sm transition-all duration-300 ease-out ${
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
            className="w-full px-4 py-2 rounded bg-primary text-white placeholder-pink-200 focus:outline-none focus:ring-2 focus:ring-third"
          />
        </div>

        <div className="w-full rounded bg-second-gradient p-[1px] relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 pr-10 rounded bg-primary text-white placeholder-pink-200 focus:outline-none focus:ring-2 focus:ring-third"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-third focus:outline-none" />
            ) : (
              <EyeIcon className="h-5 w-5 text-third focus:outline-none" />
            )}
          </button>
        </div>

        <button
          onClick={handleLogin}
          className="w-full py-2 px-4 bg-secondary text-neutral-100 font-semibold rounded hover:brightness-105 transition focus:outline-none focus:ring-2 focus:ring-third"
        >
          로그인
        </button>
      </div>

      <div className="text-sm text-center text-neutral-100 mt-6">
        계정이 없으신가요?{" "}
        <Link href="/register" className="text-secondary hover:underline focus:outline-none">
          회원가입
        </Link>
      </div>
    </>
  );
};

export default LoginPage;