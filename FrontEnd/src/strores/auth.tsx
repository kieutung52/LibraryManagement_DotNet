import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { User } from '../types/user'
import { authService } from '../services/auth'

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const current = authService.getCurrentUser()
    if (current) setUser(current)
  }, [])

  const value = useMemo<AuthContextType>(() => ({
    user,
    async login(email, password) {
      const u = await authService.login(email, password)
      setUser(u)
    },
    logout() {
      authService.logout()
      setUser(null)
    }
  }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
