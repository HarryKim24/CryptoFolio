"use client";

import React, { useState } from "react";
import { formatDate } from "@/utils/formatDate";
import { motion } from "framer-motion";
import { Session } from "next-auth";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const SettingsClient = ({ session }: { session: Session }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(session.user?.name ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const triggerError = (message: string) => {
    setError("");
    setShake(false);
    requestAnimationFrame(() => {
      setError(message);
      setShake(true);
    });
  };

  const handleSave = async () => {
    const isNameChanged = name !== session.user.name;
    const isPasswordChanged = !!newPassword;

    if (newPassword && newPassword !== confirmPassword) {
      triggerError("비밀번호가가 일치하지 않습니다.");
      return;
    }

    if (isNameChanged && !isPasswordChanged) {
      if (!session.user.updatedAt) {
        triggerError("최근 수정일 정보를 불러올 수 없습니다.");
        return;
      }

      const lastUpdated = new Date(session.user.updatedAt);
      const now = new Date();
      const oneMonth = 30 * 24 * 60 * 60 * 1000;

      if (now.getTime() - lastUpdated.getTime() < oneMonth) {
        triggerError("이름은 최근 수정일로부터 1개월 후에만 변경할 수 있습니다.");
        return;
      }
    }

    try {
      const res = await fetch("/api/settings/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          currentPassword,
          newPassword,
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        triggerError(msg);
        return;
      }

      alert("수정 완료");
      session.user.name = name;
      session.user.updatedAt = new Date().toISOString();
      setIsEditing(false);
      setError("");
    } catch (err) {
      console.error(err);
      triggerError("수정 중 오류 발생");
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("정말로 회원 탈퇴하시겠습니까?")) return;

    try {
      await fetch("/api/settings/delete", { method: "DELETE" });
      alert("탈퇴 완료. 메인 페이지로 이동합니다.");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      triggerError("회원 탈퇴 중 오류 발생");
    }
  };

  const renderPasswordInput = (
    label: string,
    value: string,
    setValue: (val: string) => void,
    isVisible: boolean,
    toggleVisibility: () => void,
    placeholder: string
  ) => (
    <div>
      <label className="block text-accent font-semibold pb-1">{label}</label>
      <div className="relative">
        <input
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full p-2 pr-10 rounded bg-white/5 border border-white/10 text-white placeholder:text-neutral-400 focus:outline-none"
        />
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          {isVisible ? (
            <EyeSlashIcon className="h-5 w-5 text-neutral-400 hover:text-white" />
          ) : (
            <EyeIcon className="h-5 w-5 text-neutral-400 hover:text-white" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-12rem)] px-6 py-12">
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full max-w-3xl min-w-[250px] bg-white/5 backdrop-blur-md p-10 sm:p-12 rounded-xl shadow-xl space-y-8"
      >
        <div className="flex items-center justify-between">
          <motion.h1
            key={isEditing ? "title-edit" : "title-view"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-4xl font-extrabold text-white"
          >
            {isEditing ? "프로필 수정" : "프로필"}
          </motion.h1>

          <motion.div
            key={isEditing ? "editing-controls" : "view-controls"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex gap-2"
          >
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setName(session.user?.name ?? "");
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setError("");
                    setIsEditing(false);
                  }}
                  className="text-sm px-4 py-1.5 border border-neutral-300 rounded hover:bg-white/10 transition"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  className="text-sm px-4 py-1.5 border border-accent text-accent hover:bg-accent/10 rounded transition"
                >
                  저장
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm px-4 py-1.5 border border-neutral-300 rounded hover:bg-white/10 transition"
              >
                수정
              </button>
            )}
          </motion.div>
        </div>

        <div className="text-center">
          <p
            className={`text-warning text-sm leading-tight transition-all duration-300 ease-out ${
              error ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
            } ${shake ? "shake" : ""}`}
          >
            {error || "‎"}
          </p>
        </div>

        <motion.div
          key={isEditing ? "edit" : "view"}
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-white space-y-4"
        >
          {isEditing ? (
            <>
              <div className="pb-4">
                <label className="block text-accent font-semibold pb-1">이름</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름 입력"
                  className="w-full p-2 rounded bg-white/5 border border-white/10 text-white placeholder:text-neutral-400 focus:outline-none"
                />
              </div>

              {renderPasswordInput("현재 비밀번호", currentPassword, setCurrentPassword, showCurrent, () => setShowCurrent((prev) => !prev), "현재 비밀번호")}
              {renderPasswordInput("새 비밀번호", newPassword, setNewPassword, showNew, () => setShowNew((prev) => !prev), "새 비밀번호")}
              {renderPasswordInput("새 비밀번호 확인", confirmPassword, setConfirmPassword, showConfirm, () => setShowConfirm((prev) => !prev), "새 비밀번호 확인")}
            </>
          ) : (
            <>
              <ul className="space-y-4 text-base sm:text-lg">
                <li>
                  <span className="font-semibold text-accent">이름:</span> {session.user?.name ?? "-"}
                </li>
                <li>
                  <span className="font-semibold text-accent">이메일:</span> {session.user?.email}
                </li>
                <li>
                  <span className="font-semibold text-accent">가입일:</span> {formatDate(session.user?.createdAt)}
                </li>
                <li>
                  <span className="font-semibold text-accent">최근 수정:</span> {formatDate(session.user?.updatedAt)}
                </li>
              </ul>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="pt-4 flex justify-end"
              >
                <button
                  onClick={handleDeleteAccount}
                  className="text-sm text-warning hover:text-white border border-warning hover:bg-warning px-4 py-2 rounded transition"
                >
                  회원 탈퇴
                </button>
              </motion.div>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SettingsClient;