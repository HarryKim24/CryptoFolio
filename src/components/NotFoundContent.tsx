import Link from 'next/link'
import React from 'react'

const NotFoundContent = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-main-gradient text-neutral-100 p-8">
      <h1 className="text-4xl font-bold mb-4">404 - 페이지를 찾을 수 없습니다</h1>
      <p className="text-lg text-gray-300 mb-6">
        잘못된 주소를 입력했거나 존재하지 않는 페이지입니다.
      </p>

      <Link
        href="/"
        className="px-4 py-2 bg-secondary text-neutral-100 rounded hover:brightness-110 transition"
      >
        홈페이지로 돌아가기
      </Link>
    </div>
  )
}

export default NotFoundContent