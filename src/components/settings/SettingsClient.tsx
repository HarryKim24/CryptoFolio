"use client";

import React, { useState } from "react";
import { formatDate } from "@/utils/formatDate";
import { AnimatePresence, motion } from "framer-motion";
import { Session } from "next-auth";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";

const SettingsClient = ({ session }: { session: Session }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localUser, setLocalUser] = useState(() => ({
    name: session.user?.name ?? "",
    email: session.user?.email ?? "",
    createdAt: session.user?.createdAt,
    updatedAt: session.user?.updatedAt,
  }));

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteShake, setDeleteShake] = useState(false);

  const triggerError = (message: string) => {
    setError("");
    setShake(false);
    requestAnimationFrame(() => {
      setError(message);
      setShake(true);
    });
  };

  const triggerDeleteError = (message: string) => {
    setDeleteError("");
    setDeleteShake(false);
    requestAnimationFrame(() => {
      setDeleteError(message);
      setDeleteShake(true);
    });
  };

  const handleSave = async () => {
    const isNameChanged = localUser.name !== session.user.name;
    const isPasswordChanged = !!newPassword;

    if (newPassword && newPassword !== confirmPassword) {
      triggerError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (newPassword && currentPassword && newPassword === currentPassword) {
      triggerError("새 비밀번호는 현재 비밀번호와 달라야 합니다.");
      return;
    }

    if (isNameChanged && !isPasswordChanged) {
      if (!localUser.updatedAt) {
        triggerError("최근 수정일 정보를 불러올 수 없습니다.");
        return;
      }

      const lastUpdated = new Date(localUser.updatedAt);
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
          name: localUser.name,
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
      setLocalUser((prev) => ({
        ...prev,
        updatedAt: new Date().toISOString(),
      }));

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsEditing(false);
      setError("");
    } catch (err) {
      console.error(err);
      triggerError("수정 중 오류 발생");
    }
  };

  const handleDeleteAccount = async () => {
    if (!passwordInput.trim()) {
      triggerDeleteError("비밀번호를 입력하세요.");
      return;
    }

    try {
      const res = await fetch("/api/settings/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });

      if (!res.ok) {
        const msg = await res.text();
        console.warn("서버 오류:", msg);
        triggerDeleteError("잘못된 비밀번호를 입력했습니다.");
        return;
      }

      alert("탈퇴 완료. 메인 페이지로 이동합니다.");
      await signOut({ callbackUrl: "/" });
    } catch (err) {
      console.error(err);
      triggerDeleteError("회원 탈퇴 중 오류 발생");
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
      <label className="block text-third font-semibold pb-1">{label}</label>
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
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl min-w-[250px] bg-white/5 p-10 sm:p-12 rounded-xl shadow space-y-3"
      >
        <div className="flex items-center justify-between">
          <motion.h1
            key={isEditing ? "title-edit" : "title-view"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-2xl md:text-4xl font-extrabold text-white"
          >
            {isEditing ? "프로필 수정" : "프로필"}
          </motion.h1>

          <motion.div
            key={isEditing ? "editing-controls" : "view-controls"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex gap-2"
          >
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setLocalUser((prev) => ({
                      ...prev,
                      name: session.user?.name ?? "",
                    }));
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setError("");
                    setIsEditing(false);
                  }}
                  className="text-sm px-3 py-1.5 text-neutral-100 border border-neutral-100 rounded bg-setting hover:brightness-105 transition whitespace-nowrap"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  className="text-sm px-3 py-1.5 text-setting bg-third hover:brightness-105 rounded transition whitespace-nowrap"
                >
                  저장
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm px-3 py-1.5 border border-neutral-100 bg-setting rounded hover:brightness-105 transition"
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
            {error ?? "‎"}
          </p>
        </div>

        <motion.div
          key={isEditing ? "edit" : "view"}
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-white space-y-4"
        >
          {isEditing ? (
            <>
              <div className="pb-4">
                <label className="block text-third font-semibold pb-1">이름</label>
                <input
                  type="text"
                  value={localUser.name}
                  onChange={(e) =>
                    setLocalUser((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="이름 입력"
                  className="w-full p-2 rounded bg-white/5 border border-white/10 text-white placeholder:text-neutral-400 focus:outline-none"
                />
              </div>

              {renderPasswordInput("현재 비밀번호", currentPassword, setCurrentPassword, showCurrent, () => setShowCurrent(!showCurrent), "현재 비밀번호")}
              {renderPasswordInput("새 비밀번호", newPassword, setNewPassword, showNew, () => setShowNew(!showNew), "새 비밀번호")}
              {renderPasswordInput("새 비밀번호 확인", confirmPassword, setConfirmPassword, showConfirm, () => setShowConfirm(!showConfirm), "새 비밀번호 확인")}
            </>
          ) : (
            <>
              <ul className="space-y-4 text-base sm:text-lg">
                <li><span className="font-semibold text-third">이름:</span> {localUser.name || "-"}</li>
                <li><span className="font-semibold text-third">이메일:</span> {localUser.email ?? "-"}</li>
                <li><span className="font-semibold text-third">가입일:</span> {formatDate(localUser.createdAt) ?? "-"}</li>
                <li><span className="font-semibold text-third">최근 수정:</span> {formatDate(localUser.updatedAt) ?? "-"}</li>
              </ul>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="pt-4 flex justify-end"
              >
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="text-sm text-neutral-100 hover:brightness-105 bg-red-500 px-4 py-2 rounded transition"
                >
                  회원 탈퇴
                </button>
              </motion.div>
            </>
          )}
        </motion.div>

        <AnimatePresence>
          {showDeleteModal && (
            <div className="fixed inset-0 px-6 z-50 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white/5 p-6 rounded-xl backdrop-blur-2xl shadow space-y-4"
              >
                <h2 className="text-neutral-100 text-lg font-bold">비밀번호 확인</h2>
                <p className={`text-warning text-sm leading-tight text-center transition-all duration-300 ease-out ${deleteError ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"} ${deleteShake ? "shake" : ""}`}>
                  {deleteError ?? "‎"}
                </p>
                <input
                  type="password"
                  placeholder="현재 비밀번호 입력"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full p-2 rounded bg-white/10 border border-white/20 text-neutral-100 placeholder:text-neutral-100 focus:outline-none"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setPasswordInput("");
                      setDeleteError("");
                    }}
                    className="text-sm px-4 py-1.5 rounded transition border border-neutral-100 text-neutral-100 bg-setting hover:brightness-105"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="text-sm px-4 py-1.5 rounded text-neutral-100 bg-red-500 hover:brightness-105"
                  >
                    탈퇴
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SettingsClient;