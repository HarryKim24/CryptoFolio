"use client";

import React, { useState } from "react";
import { formatDate } from "@/utils/formatDate";
import { motion } from "framer-motion";
import { Session } from "next-auth";

const SettingsClient = ({ session }: { session: Session }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(session.user?.name ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      alert("새 비밀번호와 확인이 일치하지 않습니다.");
      return;
    }

    try {
      await fetch("/api/settings/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          currentPassword,
          newPassword,
        }),
      });

      alert("수정 완료");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("수정 중 오류 발생");
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
      alert("회원 탈퇴 중 오류 발생");
    }
  };

  const buttonStyle =
    "text-sm px-4 py-1.5 border border-neutral-300 rounded hover:bg-white/10 transition";

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] px-6 py-12">
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
                <button onClick={() => setIsEditing(false)} className={buttonStyle}>
                  취소
                </button>
                <button
                  onClick={handleSave}
                  className={`${buttonStyle} text-accent border-accent hover:bg-accent/10`}
                >
                  저장
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className={buttonStyle}>
                수정
              </button>
            )}
          </motion.div>
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
              <div>
                <label className="block text-accent font-semibold pb-1">이름</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름 입력"
                  className="w-full p-2 rounded bg-white/5 border border-white/10 text-white placeholder:text-neutral-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-accent font-semibold pb-1">현재 비밀번호</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="현재 비밀번호"
                  className="w-full p-2 rounded bg-white/5 border border-white/10 text-white placeholder:text-neutral-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-accent font-semibold pb-1">새 비밀번호</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="새 비밀번호"
                  className="w-full p-2 rounded bg-white/5 border border-white/10 text-white placeholder:text-neutral-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-accent font-semibold pb-1">새 비밀번호 확인</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="새 비밀번호 확인"
                  className="w-full p-2 rounded bg-white/5 border border-white/10 text-white placeholder:text-neutral-400 focus:outline-none"
                />
              </div>
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
                  <span className="font-semibold text-accent">가입일:</span>{" "}
                  {formatDate(session.user?.createdAt)}
                </li>
                <li>
                  <span className="font-semibold text-accent">최근 수정:</span>{" "}
                  {formatDate(session.user?.updatedAt)}
                </li>
              </ul>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="pt-6 flex justify-end"
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