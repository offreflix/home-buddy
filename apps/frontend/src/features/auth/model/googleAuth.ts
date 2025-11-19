'use client'

export interface GoogleAuthResponse {
  success?: boolean
  error?: string
  message?: string
  user?: {
    id: string
    username: string
    email: string
  }
}

export interface GoogleAuthOptions {
  onSuccess?: (user: GoogleAuthResponse['user']) => void
  onError?: (error: string, message?: string) => void
  onCancel?: () => void
  timeout?: number
}

export class GoogleAuthManager {
  private popup: Window | null = null
  private listener: ((event: MessageEvent) => void) | null = null
  private checkClosedInterval: NodeJS.Timeout | null = null
  private timeoutId: NodeJS.Timeout | null = null

  private readonly validOrigins = [process.env.NEXT_PUBLIC_API_BASE_URL].filter(
    Boolean,
  )

  public openGoogleLogin(options: GoogleAuthOptions = {}) {
    this.cleanup()

    const {
      onSuccess,
      onError,
      onCancel,
      timeout = 60000, // 1 minuto por padrão
    } = options

    this.popup = window.open(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`,
      'google-auth',
      'width=500,height=600,scrollbars=yes,resizable=yes',
    )

    if (!this.popup) {
      onError?.(
        'popup_blocked',
        'Popup bloqueado. Permita popups para este site e tente novamente.',
      )
      return
    }

    this.listener = (event: MessageEvent) => {
      this.handleMessage(event, { onSuccess, onError })
    }

    window.addEventListener('message', this.listener)

    this.checkClosedInterval = setInterval(() => {
      if (this.popup?.closed) {
        this.cleanup()
        onCancel?.()
      }
    }, 1000)

    this.timeoutId = setTimeout(() => {
      if (this.popup && !this.popup.closed) {
        this.cleanup()
        onError?.('timeout', 'Timeout na autenticação. Tente novamente.')
      }
    }, timeout)
  }

  private handleMessage(
    event: MessageEvent,
    callbacks: Pick<GoogleAuthOptions, 'onSuccess' | 'onError'>,
  ) {
    const { onSuccess, onError } = callbacks

    if (!this.validOrigins.includes(event.origin)) {
      console.warn('Origem não autorizada:', event.origin)
      return
    }

    const { success, error, message, user } = event.data as GoogleAuthResponse

    if (error) {
      console.error('Erro no login Google:', error, message)
      this.cleanup()
      onError?.(error, message)
      return
    }

    if (success) {
      this.cleanup()
      onSuccess?.(user)
      return
    }
  }

  private cleanup() {
    if (this.popup && !this.popup.closed) {
      this.popup.close()
    }
    this.popup = null

    if (this.listener) {
      window.removeEventListener('message', this.listener)
      this.listener = null
    }

    if (this.checkClosedInterval) {
      clearInterval(this.checkClosedInterval)
      this.checkClosedInterval = null
    }

    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  }

  public destroy() {
    this.cleanup()
  }

  public async verifyCookies(): Promise<boolean> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify-cookie`,
        {
          method: 'GET',
          credentials: 'include',
        },
      )

      return response.ok
    } catch {
      return false
    }
  }
}

export function getGoogleAuthErrorMessage(
  error: string,
  message?: string,
): string {
  if (message) return message

  switch (error) {
    case 'user_conflict':
      return 'Este email já está cadastrado. Entre com seu usuário e senha ou vincule sua conta.'

    case 'auth_failed':
      return 'Falha na autenticação. Tente novamente.'

    case 'cancelled':
      return 'Login cancelado pelo usuário.'

    case 'popup_blocked':
      return 'Popup bloqueado. Permita popups para este site e tente novamente.'

    case 'timeout':
      return 'Timeout na autenticação. Tente novamente.'

    default:
      return 'Erro inesperado. Tente novamente.'
  }
}
