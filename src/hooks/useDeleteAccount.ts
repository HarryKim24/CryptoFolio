import { Dispatch, SetStateAction } from "react";
import { signOut } from "next-auth/react";

type ErrorController = {
  trigger: (msg: string) => void;
  reset: () => void;
};

type UseDeleteAccountParams = {
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  errorController: ErrorController;
};

export const useDeleteAccount = ({
  password,
  setPassword,
  setShowModal,
  errorController,
}: UseDeleteAccountParams) => {
  const handleDeleteAccount = async () => {
    if (!password.trim()) {
      errorController.trigger("비밀번호를 입력하세요.");
      return;
    }

    try {
      const res = await fetch("/api/settings/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        errorController.trigger("잘못된 비밀번호를 입력했습니다.");
        return;
      }

      alert("탈퇴 완료. 메인 페이지로 이동합니다.");
      await signOut({ callbackUrl: "/" });
    } catch (err) {
      console.error(err);
      errorController.trigger("회원 탈퇴 중 오류 발생");
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setPassword("");
    errorController.reset();
  };

  return { handleDeleteAccount, handleCancel };
};