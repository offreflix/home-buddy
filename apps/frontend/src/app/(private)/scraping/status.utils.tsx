import { AlertCircle, CheckCircle, Clock, Loader2 } from 'lucide-react'
import { JobStatus, JobPhase } from './scraping.type'
import { ReactNode } from 'react'

export const getStatusIcon = (
  state: JobStatus,
  isLoading: boolean,
): ReactNode => {
  if (isLoading) return <Loader2 className="h-4 w-4 animate-spin" />

  switch (state) {
    case 'waiting':
      return <Clock className="h-4 w-4" />
    case 'active':
      return <Loader2 className="h-4 w-4 animate-spin" />
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case 'failed':
      return <AlertCircle className="h-4 w-4 text-red-500" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

export const getStatusColor = (state: JobStatus): string => {
  switch (state) {
    case 'waiting':
      return 'bg-yellow-100 text-yellow-800'
    case 'active':
      return 'bg-blue-100 text-blue-800'
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'failed':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export const getPhaseLabel = (phase: JobPhase): string => {
  switch (phase) {
    case 'queued':
      return 'Na Fila'
    case 'scraping':
      return 'Extraindo Dados'
    case 'matching':
      return 'Comparando com IA'
    case 'finalizing':
      return 'Finalizando'
    case 'completed':
      return 'Concluído'
    case 'failed':
      return 'Falhou'
    default:
      return 'Desconhecido'
  }
}

export const getPhaseColor = (phase: JobPhase): string => {
  switch (phase) {
    case 'queued':
      return 'bg-yellow-100 text-yellow-800'
    case 'scraping':
      return 'bg-blue-100 text-blue-800'
    case 'matching':
      return 'bg-purple-100 text-purple-800'
    case 'finalizing':
      return 'bg-indigo-100 text-indigo-800'
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'failed':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
