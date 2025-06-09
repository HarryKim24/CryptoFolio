"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { User } from "@/types/user";

const RegisterPage = () => {
  const [email, setEmail] = useState<User["email"]>("");
  const [name, setName] = useState<User["name"]>("");
  const [password, setPassword] = useState<User["password"]>("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
  
  const validateInputs = () => {
    const nameRegex = /^[가-힣a-zA-Z]{1,8}$/;
  
    if (!nameRegex.test(name)) {
      triggerError("이름은 한글 또는 영문만 사용 가능하며 8자 이내여야 합니다.");
      return false;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      triggerError("유효한 이메일 형식을 입력하세요.");
      return false;
    }
  
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      triggerError("비밀번호는 영문과 숫자를 포함한 8자 이상이어야 합니다.");
      return false;
    }
  
    if (password !== confirmPassword) {
      triggerError("비밀번호가 일치하지 않습니다.");
      return false;
    }
  
    return true;
  };
  
  const handleRegister = async () => {
    if (!validateInputs()) return;

    const user: Pick<User, "email" | "password" | "name"> = {
      email,
      password,
      name,
    };

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (res.status === 201) {
        router.push("/login");
      } else {
        const text = await res.text();
        triggerError(text);
      }
    } catch {
      triggerError("서버 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-neutral-100 mb-2 text-center">
        회원가입
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
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded bg-secondary text-white placeholder-pink-200 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

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

        <div className="w-full rounded bg-second-gradient p-[1px]">
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 rounded bg-secondary text-white placeholder-pink-200 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <button
          onClick={handleRegister}
          className="w-full py-2 px-4 bg-second-gradient text-secondary font-semibold rounded hover:brightness-105 transition"
        >
          회원가입
        </button>
      </div>

      <div className="text-sm text-center text-neutral-100 mt-6">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="text-accent hover:underline">
          로그인
        </Link>
      </div>
    </>
  );
};

export default RegisterPage;