import { useState, useEffect, useCallback } from 'react'

export interface JobStatus {
  jobId: string
  state: 'waiting' | 'active' | 'completed' | 'failed'
  progress: number
  message: string
  phase: 'queued' | 'scraping' | 'completed' | 'failed'
  result?: any
  matchResult?: {
    match: Array<{
      scrap_title: string
      product_id: string
      confidence: number
    }>
    unmatch: Array<{
      title: string
      code?: string
      quantity?: string
      unit?: string
      unitPrice?: string
      totalPrice?: string
    }>
  }
  failedReason?: string
  data?: any
  timestamp?: number
  processedOn?: number
  finishedOn?: number
}

export interface UseJobPollingReturn {
  status: JobStatus | null
  isLoading: boolean
  error: string | null
  isCompleted: boolean
  isFailed: boolean
  progress: number
  message: string
  hasMatchResult: boolean
  matchResult: JobStatus['matchResult']
}

export const useJobPolling = (jobId: string | null): UseJobPollingReturn => {
  const [status, setStatus] = useState<JobStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchJobStatus = useCallback(async (id: string): Promise<JobStatus> => {
    const response = await fetch(`/api/scrapping/queue/status/${id}`)

    if (!response.ok) {
      throw new Error('Erro ao buscar status do job')
    }

    return response.json()
  }, [])

  const pollJobStatus = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true)
        setError(null)

        const jobStatus = await fetchJobStatus(id)
        setStatus(jobStatus)

        // Polling adaptativo baseado no estado
        if (jobStatus.state === 'active') {
          // Durante processamento: poll a cada 2 segundos
          setTimeout(() => pollJobStatus(id), 2000)
        } else if (jobStatus.state === 'waiting') {
          // Na fila: poll a cada 5 segundos
          setTimeout(() => pollJobStatus(id), 5000)
        } else if (
          jobStatus.state === 'completed' ||
          jobStatus.state === 'failed'
        ) {
          // Job finalizado: parar polling
          setIsLoading(false)
          return
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
        setIsLoading(false)

        // Em caso de erro: tentar novamente em 10 segundos
        setTimeout(() => pollJobStatus(id), 10000)
      }
    },
    [fetchJobStatus],
  )

  useEffect(() => {
    if (!jobId) {
      setStatus(null)
      setIsLoading(false)
      setError(null)
      return
    }

    // Iniciar polling
    pollJobStatus(jobId)

    // Cleanup: parar polling quando componente desmontar
    return () => {
      // O timeout será limpo automaticamente quando o componente desmontar
    }
  }, [jobId, pollJobStatus])

  return {
    status,
    isLoading,
    error,
    isCompleted: status?.state === 'completed',
    isFailed: status?.state === 'failed',
    progress: status?.progress || 0,
    message: status?.message || '',
    hasMatchResult: Boolean(status?.matchResult),
    matchResult: status?.matchResult,
  }
}
