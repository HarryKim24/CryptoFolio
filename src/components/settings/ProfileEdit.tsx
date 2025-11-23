'use client'

type ProfileEditProps = {
  name: string
  onChangeName: (value: string) => void
  currentPassword: string
  newPassword: string
  confirmPassword: string
  onChangeCurrentPassword: (value: string) => void
  onChangeNewPassword: (value: string) => void
  onChangeConfirmPassword: (value: string) => void
  showCurrent: boolean
  showNew: boolean
  showConfirm: boolean
  onToggleShowCurrent: () => void
  onToggleShowNew: () => void
  onToggleShowConfirm: () => void
}

import PasswordField from './PasswordField'

const ProfileEdit = ({
  name,
  onChangeName,
  currentPassword,
  newPassword,
  confirmPassword,
  onChangeCurrentPassword,
  onChangeNewPassword,
  onChangeConfirmPassword,
  showCurrent,
  showNew,
  showConfirm,
  onToggleShowCurrent,
  onToggleShowNew,
  onToggleShowConfirm,
}: ProfileEditProps) => {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeName(e.target.value)
  }

  return (
    <>
      <div className="pb-4">
        <label className="block text-third font-semibold pb-1">이름</label>
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="이름 입력"
          className="w-full p-2 rounded bg-white/5 border border-white/10 text-white placeholder:text-neutral-400 focus:outline-none"
        />
      </div>

      <PasswordField
        label="현재 비밀번호"
        value={currentPassword}
        onChange={onChangeCurrentPassword}
        isVisible={showCurrent}
        onToggleVisibility={onToggleShowCurrent}
        placeholder="현재 비밀번호"
      />

      <PasswordField
        label="새 비밀번호"
        value={newPassword}
        onChange={onChangeNewPassword}
        isVisible={showNew}
        onToggleVisibility={onToggleShowNew}
        placeholder="새 비밀번호"
      />

      <PasswordField
        label="새 비밀번호 확인"
        value={confirmPassword}
        onChange={onChangeConfirmPassword}
        isVisible={showConfirm}
        onToggleVisibility={onToggleShowConfirm}
        placeholder="새 비밀번호 확인"
      />
    </>
  )
}

export default ProfileEdit