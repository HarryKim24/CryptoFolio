'use client'

import React, { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

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

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 bg-gray/60 flex items-center justify-center px-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/5 backdrop-blur-3xl rounded-xl shadow-xl p-6 w-full max-w-sm text-neutral-100"
          >
            <h2 className="text-xl font-bold mb-2">{title}</h2>
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ConfirmModal