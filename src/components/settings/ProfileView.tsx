"use client";

import React from "react";
import { formatDate } from "@/utils/formatDate";
import { LocalUserState } from "@/hooks/useSaveSettings";

type ProfileViewProps = {
  user: LocalUserState;
  onClickDelete: () => void;
};

const ProfileView: React.FC<ProfileViewProps> = ({ user, onClickDelete }) => {
  return (
    <>
      <ul className="space-y-4 text-base sm:text-lg">
        <li>
          <span className="font-semibold text-third">이름:</span>{" "}
          {user.name ?? "-"}
        </li>
        <li>
          <span className="font-semibold text-third">이메일:</span>{" "}
          {user.email ?? "-"}
        </li>
        <li>
          <span className="font-semibold text-third">가입일:</span>{" "}
          {formatDate(user.createdAt) ?? "-"}
        </li>
        <li>
          <span className="font-semibold text-third">최근 수정:</span>{" "}
          {formatDate(user.updatedAt) ?? "-"}
        </li>
      </ul>
      <div className="pt-4 flex justify-end">
        <button
          onClick={onClickDelete}
          className="text-sm text-neutral-100 hover:brightness-105 bg-red-500 px-4 py-2 rounded transition"
        >
          회원 탈퇴
        </button>
      </div>
    </>
  );
};

export default ProfileView;