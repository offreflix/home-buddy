'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

type LoginResponse = {
  access_token?: string
  error?: string
  status: number
}

export async function login(formData: FormData): Promise<LoginResponse> {
  const username = formData.get('username')
  const password = formData.get('password')
  const cookiesData = await cookies()

  try {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })

    if (response.ok) {
      const data = await response.json()
      const { access_token } = data

      cookiesData.set({
        name: 'access_token',
        value: access_token,
        httpOnly: true,
        path: '/',
        secure: true,
        expires: new Date(Date.now() + 1000 * 60 * 15), // 15 minutos
      })

      return { access_token, status: response.status }
    }

    return { error: 'Authentication failed', status: response.status }
  } catch (error) {
    console.error('Login error:', error)
    return { error: 'An unexpected error occurred', status: 500 }
  }
}

type RegisterResponse = {
  success?: boolean
  error?: string
  status: number
}

export async function register(formData: FormData): Promise<RegisterResponse> {
  const username = formData.get('username')
  const email = formData.get('email')
  const password = formData.get('password')

  try {
    const response = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    })

    if (response.ok) {
      return { success: true, status: response.status }
    }

    return { error: 'Registration failed', status: response.status }
  } catch (error) {
    console.error('Registration error:', error)
    return { error: 'An unexpected error occurred', status: 500 }
  }
}

export async function logout() {
  const cookiesData = await cookies()
  cookiesData.delete('access_token')
  redirect('/login')
}
