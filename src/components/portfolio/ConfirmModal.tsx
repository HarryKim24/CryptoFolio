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
  description,
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
      <div className="bg-white/5 backdrop-blur-3xl rounded-xl shadow-xl p-6 w-full max-w-sm text-neutral-100">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        {description && (
          <p className="text-sm text-neutral-300 mb-4">{description}</p>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm transition"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-red-500 hover:brightness-105 text-sm font-semibold transition"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal