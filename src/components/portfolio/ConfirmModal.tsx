'use client'

import React, { useEffect } from 'react'

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
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-gray/60 flex items-center justify-center px-12">
      <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-xl p-6 w-full max-w-sm text-neutral-100">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm transition"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-sm font-semibold transition"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal