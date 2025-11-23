'use client'

import type { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'

const SessionClientLayout = ({ children }: { children: ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>
}

export default SessionClientLayout