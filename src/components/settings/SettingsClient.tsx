'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Session } from 'next-auth'
import DeleteConfirmModal from './DeleteConfirmModal'
import ProfileEdit from './ProfileEdit'
import ProfileView from './ProfileView'
import { useShakeMessage } from '@/hooks/useShakeMessage'
import type { LocalUserState } from '@/hooks/useSaveSettings'
import { useSaveSettings } from '@/hooks/useSaveSettings'
import { useDeleteAccount } from '@/hooks/useDeleteAccount'

type SettingsClientProps = {
  session: Session
}

const SettingsClient = ({ session }: SettingsClientProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [localUser, setLocalUser] = useState<LocalUserState>(() => ({
    name: session.user?.name ?? '',
    email: session.user?.email ?? '',
    createdAt: session.user?.createdAt,
    updatedAt: session.user?.updatedAt,
  }))

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [passwordVisibility, setPasswordVisibility] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')

  const nameError = useShakeMessage()
  const deleteErrorState = useShakeMessage()

  const { handleSave } = useSaveSettings({
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
    errorController: nameError,
  })

  const { handleDeleteAccount, handleCancel } = useDeleteAccount({
    password: passwordInput,
    setPassword: setPasswordInput,
    setShowModal: setShowDeleteModal,
    errorController: deleteErrorState,
  })

  const handleStartEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setLocalUser((prev) => ({
      ...prev,
      name: session.user?.name ?? '',
    }))
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    nameError.reset()
    setIsEditing(false)
  }

  const handleChangeName = (value: string) => {
    setLocalUser((prev) => ({ ...prev, name: value }))
  }

  const toggleCurrentVisibility = () => {
    setPasswordVisibility((prev) => ({
      ...prev,
      current: !prev.current,
    }))
  }

  const toggleNewVisibility = () => {
    setPasswordVisibility((prev) => ({
      ...prev,
      new: !prev.new,
    }))
  }

  const toggleConfirmVisibility = () => {
    setPasswordVisibility((prev) => ({
      ...prev,
      confirm: !prev.confirm,
    }))
  }

  const handleOpenDeleteModal = () => {
    setShowDeleteModal(true)
  }

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
            key={isEditing ? 'title-edit' : 'title-view'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-2xl md:text-4xl font-extrabold text-white"
          >
            {isEditing ? '프로필 수정' : '프로필'}
          </motion.h1>

          <motion.div
            key={isEditing ? 'editing-controls' : 'view-controls'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex gap-2"
          >
            {isEditing ? (
              <>
                <button
                  onClick={handleCancelEdit}
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
                onClick={handleStartEdit}
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
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-1'
            } ${nameError.shake ? 'shake' : ''}`}
          >
            {nameError.message.trim() || ' '}
          </p>
        </div>

        <motion.div
          key={isEditing ? 'edit' : 'view'}
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-white space-y-4"
        >
          {isEditing ? (
            <ProfileEdit
              name={localUser.name}
              onChangeName={handleChangeName}
              currentPassword={currentPassword}
              newPassword={newPassword}
              confirmPassword={confirmPassword}
              onChangeCurrentPassword={setCurrentPassword}
              onChangeNewPassword={setNewPassword}
              onChangeConfirmPassword={setConfirmPassword}
              showCurrent={passwordVisibility.current}
              showNew={passwordVisibility.new}
              showConfirm={passwordVisibility.confirm}
              onToggleShowCurrent={toggleCurrentVisibility}
              onToggleShowNew={toggleNewVisibility}
              onToggleShowConfirm={toggleConfirmVisibility}
            />
          ) : (
            <ProfileView user={localUser} onClickDelete={handleOpenDeleteModal} />
          )}
        </motion.div>

        <AnimatePresence>
          {showDeleteModal && (
            <DeleteConfirmModal
              password={passwordInput}
              onPasswordChange={setPasswordInput}
              onCancel={handleCancel}
              onConfirm={handleDeleteAccount}
              errorMessage={deleteErrorState.message}
              shake={deleteErrorState.shake}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default SettingsClient