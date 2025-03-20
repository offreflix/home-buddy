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
}

type AuthContextType = {
  user: User | null
  setUser: Dispatch<SetStateAction<User | null>>
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

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
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
