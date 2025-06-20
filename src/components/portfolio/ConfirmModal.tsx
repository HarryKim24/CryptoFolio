'use client'

import React from 'react'

interface ConfirmModalProps {
  open: boolean
  title?: string
  description?: string
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmModal = ({
  open,
  title = '정말 삭제하시겠습니까?',
  description = '',
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-[#1E1E2F] p-6 rounded-xl shadow-xl text-white w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        {description && <p className="text-sm text-gray-300 mb-4">{description}</p>}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal