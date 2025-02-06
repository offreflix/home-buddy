'use server'

import { cookies } from 'next/headers'

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

      // Armazena o token em um cookie HTTP-only
      cookiesData.set({
        name: 'token',
        value: access_token,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      })

      return { access_token, status: response.status }
    }

    return { error: 'Authentication failed', status: response.status }
  } catch (error) {
    console.error('Login error:', error)
    return { error: 'An unexpected error occurred', status: 500 }
  }
}
