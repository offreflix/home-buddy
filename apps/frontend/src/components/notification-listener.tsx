'use client'

import { useEffect } from 'react'
import { useAuth } from '@/context/auth/context'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/api/client'
import { useQueryClient } from '@tanstack/react-query'

export function NotificationListener() {
  const { user } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!user) return

    // Use the baseURL from apiClient to construct the SSE URL
    const baseURL = apiClient.defaults.baseURL || 'http://localhost:3000'
    const sseURL = `${baseURL}/notifications/sse`

    const eventSource = new EventSource(sseURL, { withCredentials: true })

    eventSource.onopen = () => {
      console.log('[SSE] Connected successfully to', sseURL)
    }

    eventSource.onmessage = (event) => {
      console.log('[SSE] Raw event received:', event.data)
      try {
        const data = JSON.parse(event.data)
        handleEvent(data)
      } catch (error) {
        console.error('[SSE] Error parsing event data:', error)
      }
    }

    eventSource.onerror = (error) => {
      console.error('[SSE] Connection error:', error)
      // EventSource retries automatically, but we can handle specific errors if needed
      if (eventSource.readyState === EventSource.CLOSED) {
        console.log('[SSE] Connection closed')
      }
    }

    const handleEvent = (event: any) => {
      console.log('[SSE] Handling event:', event)

      // Invalidate queries to refresh the scraping list
      queryClient.invalidateQueries({ queryKey: ['scraping-operations'] })
      console.log('[SSE] Invalidated scraping-operations query')

      if (event.type === 'scraping.completed') {
        toast.success('Scraping concluído!', {
          description: `O processamento da URL ${event.data.url} finalizou com sucesso.`,
          action: {
            label: 'Ver',
            onClick: () => router.push(`/scraping?jobId=${event.data.jobId}`),
          },
        })
      } else if (event.type === 'scraping.failed') {
        toast.error('Falha no Scraping', {
          description: `Erro ao processar ${event.data.url}: ${event.data.error}`,
        })
      }
    }

    return () => {
      console.log('[SSE] Closing connection')
      eventSource.close()
    }
  }, [user, router, queryClient])

  return null
}
