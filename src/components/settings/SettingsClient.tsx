"use client";

import React, { useState } from "react";
import { formatDate } from "@/utils/formatDate";
import { AnimatePresence, motion } from "framer-motion";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import PasswordField from "./PasswordField";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { useShakeMessage } from "@/hooks/useShakeMessage";

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

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const nameError = useShakeMessage();
  const deleteErrorState = useShakeMessage();

  const handleSave = async () => {
    const isNameChanged = localUser.name !== session.user.name;
    const isPasswordChanged = !!newPassword;

    if (!isNameChanged && !isPasswordChanged) {
      nameError.trigger("변경된 내용이 없습니다.");
      return;
    }

    if (newPassword && !currentPassword.trim()) {
      nameError.trigger("현재 비밀번호를 입력해주세요.");
      return;
    }

    if (newPassword && !confirmPassword.trim()) {
      nameError.trigger("새 비밀번호 확인을 입력해주세요.");
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      nameError.trigger("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (newPassword && currentPassword && newPassword === currentPassword) {
      nameError.trigger("새 비밀번호는 현재 비밀번호와 달라야 합니다.");
      return;
    }

    if (isNameChanged && !localUser.name.trim()) {
      nameError.trigger("이름을 빈 값으로 변경할 수 없습니다.");
      return;
    }

    if (isNameChanged && !isPasswordChanged) {
      if (!localUser.updatedAt) {
        nameError.trigger("최근 수정일 정보를 불러올 수 없습니다.");
        return;
      }

      const lastUpdated = new Date(localUser.updatedAt);
      const now = new Date();
      const oneMonth = 30 * 24 * 60 * 60 * 1000;

      if (now.getTime() - lastUpdated.getTime() < oneMonth) {
        nameError.trigger("이름은 최근 수정일로부터 1개월 후에만 변경할 수 있습니다.");
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
        nameError.trigger(msg);
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
      nameError.reset();
    } catch (err) {
      console.error(err);
      nameError.trigger("수정 중 오류 발생");
    }
  };

  const handleDeleteAccount = async () => {
    if (!passwordInput.trim()) {
      deleteErrorState.trigger("비밀번호를 입력하세요.");
      return;
    }

    try {
      const res = await fetch("/api/settings/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });

      if (!res.ok) {
        deleteErrorState.trigger("잘못된 비밀번호를 입력했습니다.");
        return;
      }

      alert("탈퇴 완료. 메인 페이지로 이동합니다.");
      await signOut({ callbackUrl: "/" });
    } catch (err) {
      console.error(err);
      deleteErrorState.trigger("회원 탈퇴 중 오류 발생");
    }
  };

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
                    nameError.reset();
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
            className={`text-warning text-sm leading-tight transition-all duration-300 ease-out min-h-[20px] ${
              nameError.message.trim()
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-1"
            } ${nameError.shake ? "shake" : ""}`}
          >
            {nameError.message.trim() || " "}
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
                <label className="block text-third font-semibold pb-1">
                  이름
                </label>
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

              <PasswordField
                label="현재 비밀번호"
                value={currentPassword}
                onChange={setCurrentPassword}
                isVisible={showCurrent}
                onToggleVisibility={() => setShowCurrent((v) => !v)}
                placeholder="현재 비밀번호"
              />

              <PasswordField
                label="새 비밀번호"
                value={newPassword}
                onChange={setNewPassword}
                isVisible={showNew}
                onToggleVisibility={() => setShowNew((v) => !v)}
                placeholder="새 비밀번호"
              />

              <PasswordField
                label="새 비밀번호 확인"
                value={confirmPassword}
                onChange={setConfirmPassword}
                isVisible={showConfirm}
                onToggleVisibility={() => setShowConfirm((v) => !v)}
                placeholder="새 비밀번호 확인"
              />
            </>
          ) : (
            <>
              <ul className="space-y-4 text-base sm:text-lg">
                <li>
                  <span className="font-semibold text-third">이름:</span>{" "}
                  {localUser.name ?? "-"}
                </li>
                <li>
                  <span className="font-semibold text-third">이메일:</span>{" "}
                  {localUser.email ?? "-"}
                </li>
                <li>
                  <span className="font-semibold text-third">가입일:</span>{" "}
                  {formatDate(localUser.createdAt) ?? "-"}
                </li>
                <li>
                  <span className="font-semibold text-third">최근 수정:</span>{" "}
                  {formatDate(localUser.updatedAt) ?? "-"}
                </li>
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
            <DeleteConfirmModal
              password={passwordInput}
              onPasswordChange={setPasswordInput}
              onCancel={() => {
                setShowDeleteModal(false);
                setPasswordInput("");
                deleteErrorState.reset();
              }}
              onConfirm={handleDeleteAccount}
              errorMessage={deleteErrorState.message}
              shake={deleteErrorState.shake}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SettingsClient;