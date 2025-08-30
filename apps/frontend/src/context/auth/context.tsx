'use client'

import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { redirect } from 'next/navigation'
import { getUserProfile, refreshToken } from '@/features/auth/model/authActions'
import { LoadingScreen } from '@/components/loading-screen'

type User = {
  id: string
  username: string
  email: string
  picture?: string
  firstName?: string
  lastName?: string
  bio?: string
  phone?: string
  provider?: string
  createdAt?: string
  lastLoginAt?: string
  updatedAt?: string
}

type AuthContextType = {
  user: User | null
  setUser: Dispatch<SetStateAction<User | null>>
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = useCallback(async () => {
    try {
      const userProfile = await getUserProfile()

      if ('error' in userProfile) {
        await refreshSession()
      } else {
        setUser(userProfile)
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error)
      redirect('/login')
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshSession = useCallback(async () => {
    try {
      const result = await refreshToken()
      if (result.success) {
        await fetchUser()
      } else {
        redirect('/login')
      }
    } catch (error) {
      console.error('Erro ao atualizar sessão:', error)
      redirect('/login')
    }
  }, [fetchUser])

  const updateUser = useCallback((userData: Partial<User>) => {
    setUser((prevUser) =>
      prevUser
        ? {
            ...prevUser,
            ...userData,
          }
        : null,
    )
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <AuthContext.Provider value={{ user, setUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
