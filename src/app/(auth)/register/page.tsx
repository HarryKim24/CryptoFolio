"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { validateRegisterInputs } from "@/utils/validateRegisterInputs";
import { triggerError } from "@/utils/triggerError";
import SubmitButton from "@/components/auth/SubmitButton";
import AuthForm from "@/components/auth/AuthForm";
import AuthInput from "@/components/auth/AuthInput";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [shake, setShake] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const showError = (message: string) => {
    triggerError(setErrorMessage, setShake, message);
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isLoading) return;

    const validationResult = validateRegisterInputs(
      email,
      password,
      name,
      confirmPassword
    );

    if (!validationResult.valid) {
      showError(validationResult.message || "입력값을 확인해주세요.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name,
        }),
      });

      if (response.status === 201) {
        router.push("/login");
      } else {
        const text = await response.text();
        showError(text);
      }
    } catch {
      showError("서버 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-neutral-100 mb-2 text-center">
        회원가입
      </h1>

      <AuthForm onSubmit={handleRegister} error={errorMessage} shake={shake}>
        <AuthInput
          type="text"
          placeholder="이름"
          value={name}
          onChange={setName}
        />
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
        <AuthInput
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={setConfirmPassword}
          showPasswordToggle
        />
        <SubmitButton
          loading={isLoading}
          idleText="회원가입"
          loadingText="회원가입 중..."
          className="w-full py-2 px-4 bg-secondary font-semibold rounded hover:brightness-105 transition focus:outline-none text-neutral-100 focus:ring-2 focus:ring-third disabled:opacity-60 disabled:cursor-not-allowed"
        />
      </AuthForm>

      <div className="text-sm text-center text-neutral-100 mt-6">
        이미 계정이 있으신가요?{" "}
        <Link
          href="/login"
          className="text-secondary hover:underline focus:outline-none"
        >
          로그인
        </Link>
      </div>
    </>
  );
};

export default RegisterPage;