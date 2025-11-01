"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import ErrorMessage from "@/components/auth/ErrorMessage";
import TextInput from "@/components/auth/TextInput";
import PasswordInput from "@/components/auth/PasswordInput";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const triggerError = (message: string) => {
    setError("");
    setShake(false);
    requestAnimationFrame(() => {
      setError(message);
      setShake(true);
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return; 

    if (!email || !password) {
      triggerError("이메일과 비밀번호를 모두 입력하세요.");
      return;
    }

    try {
      setLoading(true); 
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
    } catch {
      triggerError("로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-neutral-100 mb-2 text-center">
        로그인
      </h1>

      <ErrorMessage message={error} shake={shake} />

      <form className="space-y-4" onSubmit={handleLogin} noValidate>
        <TextInput
          type="email"
          placeholder="이메일"
          value={email}
          onChange={setEmail}
        />

        <PasswordInput
          value={password}
          onChange={setPassword}
          placeholder="비밀번호"
        />

        <button
          type="submit"
          disabled={loading}      
          aria-busy={loading}         
          className="w-full py-2 px-4 bg-secondary text-neutral-100 font-semibold rounded hover:brightness-105 transition focus:outline-none focus:ring-2 focus:ring-third disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <div className="text-sm text-center text-neutral-100 mt-6">
        계정이 없으신가요?{" "}
        <Link
          href="/register"
          className="text-secondary hover:underline focus:outline-none"
        >
          회원가입
        </Link>
      </div>
    </>
  );
};

export default LoginPage;