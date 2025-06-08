"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.status === 201) {
      router.push("/login");
    } else {
      const text = await res.text();
      setError(text);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-white mb-4 text-center">회원가입</h1>
      <div className="space-y-4">
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          onClick={handleRegister}
          className="w-full py-2 px-4 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-400 transition"
        >
          회원가입
        </button>
      </div>
    </>
  );
};

export default RegisterPage;