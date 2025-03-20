'use client'

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'
import { redirect } from 'next/navigation'
import { getUserProfile } from '@/features/auth/model/authActions'
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

  useEffect(() => {
    const fetchUser = async () => {
      const userProfile = await getUserProfile()
      if ('error' in userProfile) {
        redirect('/login')
      } else {
        setUser(userProfile)
      }
      setLoading(false)
    }

    fetchUser()
  }, [])

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
