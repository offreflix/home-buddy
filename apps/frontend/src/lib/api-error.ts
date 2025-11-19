import { AxiosError } from 'axios'

export interface ApiErrorResponse {
  message?: string
  error?: string
  statusCode?: number
}

export type ApiError = AxiosError<ApiErrorResponse>

/**
 * Type guard para verificar se um erro é um ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as { response?: unknown }).response === 'object'
  )
}

/**
 * Extrai a mensagem de erro de forma type-safe
 */
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Erro desconhecido'
    )
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Erro desconhecido'
}

/**
 * Extrai o código de erro (ex: ECONNABORTED para timeout)
 */
export function getErrorCode(error: unknown): string | undefined {
  if (isApiError(error)) {
    return error.code
  }

  if (error instanceof Error && 'code' in error) {
    return (error as { code?: string }).code
  }

  return undefined
}

