'use server'

import axios from 'axios'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

type LoginResponse = {
  access_token?: string
  error?: string
  status: number
}

export async function login(formData: FormData): Promise<LoginResponse> {
  const username = formData.get('username')
  const password = formData.get('password')
  const cookiesStore = await cookies()

  console.log(API_BASE_URL)

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })

    console.log(response)

    if (response.ok) {
      const data = await response.json()
      const { access_token, refresh_token } = data

      cookiesStore.set({
        name: 'access_token',
        value: access_token,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        // domain: '.railway.app',
        path: '/',
        expires: new Date(Date.now() + 1000 * 60 * 15), // 15 minutos
      })

      cookiesStore.set({
        name: 'refresh_token',
        value: refresh_token,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        // domain: '.railway.app',
        path: '/',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 dias
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
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
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

export async function logout(): Promise<void> {
  const cookiesStore = await cookies()
  cookiesStore.delete('access_token')
  cookiesStore.delete('refresh_token')
  redirect('/login')
}

export async function refreshToken(): Promise<{
  success?: boolean
  error?: string
}> {
  const cookiesStore = await cookies()

  const refreshToken = cookiesStore.get('refresh_token')?.value

  if (!refreshToken) {
    redirect('/login')
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    if (!response.ok) {
      redirect('/login')
    }

    const { access_token, refresh_token } = await response.json()

    cookiesStore.set({
      name: 'access_token',
      value: access_token,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: '.railway.app',
      path: '/',
      expires: new Date(Date.now() + 1000 * 60 * 15), // 15 minutos
    })

    cookiesStore.set({
      name: 'refresh_token',
      value: refresh_token,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: '.railway.app',
      path: '/',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 dias
    })

    return { success: true }
  } catch (error) {
    cookiesStore.delete('access_token')
    cookiesStore.delete('refresh_token')
    console.error('Refresh token error:', error)
    redirect('/login')
  }
}

type User = {
  id: string
  username: string
  email: string
}

export async function getUserProfile(): Promise<
  User | { error: string; status: number }
> {
  try {
    const cookiesStore = await cookies()
    const accessToken = cookiesStore.get('access_token')?.value
    const refreshToken = cookiesStore.get('refresh_token')?.value

    console.log('Server Access Token:', accessToken)
    console.log('Server Refresh Token:', refreshToken)

    if (!accessToken) {
      return { error: 'No access token found', status: 401 }
    }

    const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: {
        'Content-Type': 'application/json',
        Cookie: `access_token=${accessToken}; refresh_token=${refreshToken}`,
      },
      withCredentials: true,
    })

    return { ...response.data, status: response.status }
  } catch (error) {
    console.error('User profile fetch error:', error)
    return error as { error: string; status: number }
  }
}
