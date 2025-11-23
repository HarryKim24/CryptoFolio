"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { triggerError } from "@/utils/triggerError";
import SubmitButton from "@/components/auth/SubmitButton";
import AuthForm from "@/components/auth/AuthForm";
import AuthInput from "@/components/auth/AuthInput";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [shake, setShake] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const showError = (message: string) => {
    triggerError(setErrorMessage, setShake, message);
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    if (!email || !password) {
      showError("이메일과 비밀번호를 모두 입력하세요.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (response?.ok) {
        router.push("/");
      } else {
        showError("이메일 또는 비밀번호가 틀렸습니다.");
      }
    } catch {
      showError("로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-neutral-100 mb-2 text-center">
        로그인
      </h1>

      <AuthForm onSubmit={handleLogin} error={errorMessage} shake={shake}>
        <AuthInput
          type="email"
          placeholder="이메일"
          value={email}
          onChange={setEmail}
        />
        <AuthInput
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={setPassword}
          showPasswordToggle
        />
        <SubmitButton
          loading={isLoading}
          idleText="로그인"
          loadingText="로그인 중..."
          className="w-full py-2 px-4 bg-secondary text-neutral-100 font-semibold rounded hover:brightness-105 transition focus:outline-none focus:ring-2 focus:ring-third disabled:opacity-60 disabled:cursor-not-allowed"
        />
      </AuthForm>

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