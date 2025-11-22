import { Session } from "next-auth";
import { Dispatch, SetStateAction } from "react";

export type LocalUserState = {
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
};

type ErrorController = {
  trigger: (msg: string) => void;
  reset: () => void;
};

type UseSaveSettingsParams = {
  session: Session;
  localUser: LocalUserState;
  setLocalUser: Dispatch<SetStateAction<LocalUserState>>;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  setCurrentPassword: Dispatch<SetStateAction<string>>;
  setNewPassword: Dispatch<SetStateAction<string>>;
  setConfirmPassword: Dispatch<SetStateAction<string>>;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  errorController: ErrorController;
};

export const useSaveSettings = ({
  session,
  localUser,
  setLocalUser,
  currentPassword,
  newPassword,
  confirmPassword,
  setCurrentPassword,
  setNewPassword,
  setConfirmPassword,
  setIsEditing,
  errorController,
}: UseSaveSettingsParams) => {
  const handleSave = async () => {
    const isNameChanged = localUser.name !== (session.user?.name ?? "");
    const isPasswordChanged = !!newPassword;

    if (!isNameChanged && !isPasswordChanged) {
      errorController.trigger("변경된 내용이 없습니다.");
      return;
    }

    if (newPassword && !currentPassword.trim()) {
      errorController.trigger("현재 비밀번호를 입력해주세요.");
      return;
    }

    if (newPassword && !confirmPassword.trim()) {
      errorController.trigger("새 비밀번호 확인을 입력해주세요.");
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      errorController.trigger("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (newPassword && currentPassword && newPassword === currentPassword) {
      errorController.trigger("새 비밀번호는 현재 비밀번호와 달라야 합니다.");
      return;
    }

    if (isNameChanged && !localUser.name.trim()) {
      errorController.trigger("이름을 빈 값으로 변경할 수 없습니다.");
      return;
    }

    if (isNameChanged && !isPasswordChanged) {
      if (!localUser.updatedAt) {
        errorController.trigger("최근 수정일 정보를 불러올 수 없습니다.");
        return;
      }

      const lastUpdated = new Date(localUser.updatedAt);
      const now = new Date();
      const oneMonth = 30 * 24 * 60 * 60 * 1000;

      if (now.getTime() - lastUpdated.getTime() < oneMonth) {
        errorController.trigger(
          "이름은 최근 수정일로부터 1개월 후에만 변경할 수 있습니다."
        );
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
        errorController.trigger(msg);
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
      errorController.reset();
    } catch (err) {
      console.error(err);
      errorController.trigger("수정 중 오류 발생");
    }
  };

  return { handleSave };
};