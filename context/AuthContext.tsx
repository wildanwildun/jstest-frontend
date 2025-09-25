'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: number
  name: string
  email: string
}

interface AuthContextType {
  token: string | null
  user: User | null
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: any }>
  register: (name: string, email: string, password: string, password_confirmation: string) => Promise<{ ok: boolean; message?: any }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const t = localStorage.getItem('token')
    if (t) {
      setToken(t)
      fetchProfile(t)
    }
  }, [])

  const fetchProfile = async (t: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
        headers: { Authorization: `Bearer ${t}` },
      })
      if (res.ok) {
        const data: User = await res.json()
        setUser(data)
      } else {
        logout()
      }
    } catch {
      logout()
    }
  }

  const login = async (email: string, password: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (res.ok && data.access_token) {
      localStorage.setItem('token', data.access_token)
      setToken(data.access_token)
      await fetchProfile(data.access_token)
      return { ok: true }
    }
    return { ok: false, message: data }
  }

  const register = async (name: string, email: string, password: string, password_confirmation: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, password_confirmation }),
    })
    const data = await res.json()
    if (res.ok && data.access_token) {
      localStorage.setItem('token', data.access_token)
      setToken(data.access_token)
      await fetchProfile(data.access_token)
      return { ok: true }
    }
    return { ok: false, message: data }
  }

  const logout = async () => {
    try {
      if (token) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        })
      }
    } catch {}
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
