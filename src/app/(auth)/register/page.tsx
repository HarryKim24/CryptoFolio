"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { User } from "@/types/user";
import { validateRegisterInputs } from "@/utils/validateRegisterInputs";
import ErrorMessage from "@/components/auth/ErrorMessage";
import TextInput from "@/components/auth/TextInput";
import PasswordInput from "@/components/auth/PasswordInput";
import { triggerError } from "@/utils/triggerError";

const RegisterPage = () => {
  const [email, setEmail] = useState<User["email"]>("");
  const [name, setName] = useState<User["name"]>("");
  const [password, setPassword] = useState<User["password"]>("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const showError = (message: string) => triggerError(setError, setShake, message);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const result = validateRegisterInputs(email, password, name, confirmPassword);
    if (!result.valid) {
      showError(result.message!);
      return;
    }

    const user: Pick<User, "email" | "password" | "name"> = { email, password, name };

    try {
      setLoading(true);
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (res.status === 201) {
        router.push("/login");
      } else {
        const text = await res.text();
        showError(text);
      }
    } catch {
      showError("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-neutral-100 mb-2 text-center">회원가입</h1>

      <ErrorMessage message={error} shake={shake} />

      <form className="space-y-4" onSubmit={handleRegister} noValidate>
        <TextInput type="text" placeholder="이름" value={name} onChange={setName} />
        <TextInput type="email" placeholder="이메일" value={email} onChange={setEmail} />
        <PasswordInput value={password} onChange={setPassword} placeholder="비밀번호" />
        <PasswordInput value={confirmPassword} onChange={setConfirmPassword} placeholder="비밀번호 확인" />

        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="w-full py-2 px-4 bg-secondary font-semibold rounded hover:brightness-105 transition focus:outline-none text-third focus:ring-2 focus:ring-third disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "회원가입 중..." : "회원가입"}
        </button>
      </form>

      <div className="text-sm text-center text-neutral-100 mt-6">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="text-secondary hover:underline focus:outline-none">
          로그인
        </Link>
      </div>
    </>
  );
};

export default RegisterPage;