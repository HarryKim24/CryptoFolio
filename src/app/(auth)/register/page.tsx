"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import type { User } from "@/types/user";
import { validateRegisterInputs } from "@/utils/validateRegisterInputs";

const RegisterPage = () => {
  const [email, setEmail] = useState<User["email"]>("");
  const [name, setName] = useState<User["name"]>("");
  const [password, setPassword] = useState<User["password"]>("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handleRegister = async () => {
      const result = validateRegisterInputs(email, password, name, confirmPassword);

      if (!result.valid) {
        triggerError(result.message!);
        return;
      }

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
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded bg-primary text-white placeholder-pink-200 focus:outline-none focus:ring-2 focus:ring-third"
          />
        </div>

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
              <EyeSlashIcon className="h-5 w-5 text-pink-200 hover:text-white" />
            ) : (
              <EyeIcon className="h-5 w-5 text-pink-200 hover:text-white" />
            )}
          </button>
        </div>

        <div className="w-full rounded bg-second-gradient p-[1px] relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 pr-10 rounded bg-primary text-white placeholder-pink-200 focus:outline-none focus:ring-2 focus:ring-third"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showConfirmPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-pink-200 hover:text-white" />
            ) : (
              <EyeIcon className="h-5 w-5 text-pink-200 hover:text-white" />
            )}
          </button>
        </div>

        <button
          onClick={handleRegister}
          className="w-full py-2 px-4 bg-secondary text-neutral-100 font-semibold rounded hover:brightness-105 transition"
        >
          회원가입
        </button>
      </div>

      <div className="text-sm text-center text-neutral-100 mt-6">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="text-secondary hover:underline">
          로그인
        </Link>
      </div>
    </>
  );
};

export default RegisterPage;