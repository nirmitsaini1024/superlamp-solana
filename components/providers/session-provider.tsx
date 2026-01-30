'use client'

import { createContext, useContext, ReactNode } from 'react'
import type { User } from 'better-auth'

type ExtendedUser = User & {
  verifiedAt?: string | Date | null
  walletAddress?: string | null
}

// Define the actual session structure that matches runtime
export type ExtendedSession = {
  user: ExtendedUser
  session: {
    id: string
    userId: string
    expiresAt: Date
    createdAt: Date
    updatedAt: Date
  }
} | null

interface SessionContextType {
  session: ExtendedSession | null
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function SessionProvider({ children, session }: { children: ReactNode; session: ExtendedSession | null }) {
  return (
    <SessionContext.Provider value={{ session }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSessionContext() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error('useSessionContext must be used within a SessionProvider')
  }
  return context
}
