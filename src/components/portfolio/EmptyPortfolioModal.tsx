'use client'

import React from 'react'

interface Props {
  open: boolean
  onClose: () => void
}

const EmptyPortfolioModal = ({ open, onClose }: Props) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="bg-white/5 backdrop-blur-3xl rounded-xl shadow p-6 w-full max-w-sm text-neutral-100">
        <h2 className="text-xl font-bold mb-2">포트폴리오가 비어있어요</h2>
        <p className="text-sm text-neutral-300 mb-4">
          거래 내역을 추가해서 나만의 포트폴리오를 시작해보세요.
        </p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-portfolio hover:bg-portfolio/90 text-sm font-medium transition"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmptyPortfolioModal