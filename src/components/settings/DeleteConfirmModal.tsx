"use client";

import React from "react";
import { motion } from "framer-motion";

interface DeleteConfirmModalProps {
  password: string;
  onPasswordChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
  errorMessage: string;
  shake: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  password,
  onPasswordChange,
  onCancel,
  onConfirm,
  errorMessage,
  shake,
}) => {
  return (
    <div className="fixed inset-0 px-6 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/5 p-6 rounded-xl backdrop-blur-2xl shadow space-y-4"
      >
        <h2 className="text-neutral-100 text-lg font-bold">비밀번호 확인</h2>

        <p
          className={`text-warning text-sm leading-tight text-center transition-all duration-300 ease-out min-h-[20px] ${
            errorMessage.trim()
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-1"
          } ${shake ? "shake" : ""}`}
        >
          {errorMessage.trim() || " "}
        </p>

        <input
          type="password"
          placeholder="현재 비밀번호 입력"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          className="w-full p-2 rounded bg-white/10 border border-white/20 text-neutral-100 placeholder:text-neutral-100 focus:outline-none"
        />

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onCancel}
            className="text-sm px-4 py-1.5 rounded transition border border-neutral-100 text-neutral-100 bg-setting hover:brightness-105"
          >
            취소
          </button>

          <button
            onClick={onConfirm}
            className="text-sm px-4 py-1.5 rounded text-neutral-100 bg-red-500 hover:brightness-105"
          >
            탈퇴
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteConfirmModal;