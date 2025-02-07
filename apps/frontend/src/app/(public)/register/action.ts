'use server'

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
