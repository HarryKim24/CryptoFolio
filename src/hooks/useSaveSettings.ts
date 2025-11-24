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
    const currentName = session.user?.name ?? "";
    const isNameChanged = localUser.name !== currentName;
    const hasNewPassword = newPassword.length > 0;

    if (!isNameChanged && !hasNewPassword) {
      errorController.trigger("변경된 내용이 없습니다.");
      return;
    }

    const trimmedCurrentPassword = currentPassword.trim();
    const trimmedNewPassword = newPassword.trim();
    const trimmedConfirmPassword = confirmPassword.trim();
    const trimmedName = localUser.name.trim();

    if (hasNewPassword && !trimmedCurrentPassword) {
      errorController.trigger("현재 비밀번호를 입력해주세요.");
      return;
    }

    if (hasNewPassword && !trimmedConfirmPassword) {
      errorController.trigger("새 비밀번호 확인을 입력해주세요.");
      return;
    }

    if (hasNewPassword && trimmedNewPassword !== trimmedConfirmPassword) {
      errorController.trigger("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (hasNewPassword && trimmedCurrentPassword && trimmedNewPassword === trimmedCurrentPassword) {
      errorController.trigger("새 비밀번호는 현재 비밀번호와 달라야 합니다.");
      return;
    }

    if (isNameChanged && !trimmedName) {
      errorController.trigger("이름을 빈 값으로 변경할 수 없습니다.");
      return;
    }

    if (isNameChanged && !hasNewPassword) {
      const hasUpdatedAt = !!localUser.updatedAt;

      if (!hasUpdatedAt) {
        errorController.trigger("최근 수정일 정보를 불러올 수 없습니다.");
        return;
      }

      const lastUpdated = new Date(localUser.updatedAt as string);
      const now = new Date();

      const lastUpdatedTime = lastUpdated.getTime();
      const nowTime = now.getTime();
      const diff = nowTime - lastUpdatedTime;
      const oneMonthMs = 30 * 24 * 60 * 60 * 1000;

      const isWithinOneMonth = diff < oneMonthMs;

      if (isWithinOneMonth) {
        errorController.trigger("이름은 최근 수정일로부터 1개월 후에만 변경할 수 있습니다.");
        return;
      }
    }

    try {
      const body = JSON.stringify({
        name: trimmedName,
        currentPassword: trimmedCurrentPassword,
        newPassword: trimmedNewPassword,
      });

      const response = await fetch("/api/settings/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body,
      });

      const isError = !response.ok;

      if (isError) {
        const message = await response.text();
        errorController.trigger(message);
        return;
      }

      alert("수정 완료");

      setLocalUser((previous) => {
        return {
          ...previous,
          updatedAt: new Date().toISOString(),
        };
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsEditing(false);
      errorController.reset();
    } catch (error) {
      console.error(error);
      errorController.trigger("수정 중 오류 발생");
    }
  };

  return {
    handleSave,
  };
};