import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, Clock, Loader2 } from 'lucide-react'
import { JobStatus } from '@/hooks/use-job-polling'

interface JobProgressProps {
  status: JobStatus | null
  isLoading: boolean
  error: string | null
  isCompleted: boolean
  isFailed: boolean
  progress: number
  message: string
}

const getStatusIcon = (state: string, isLoading: boolean) => {
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

const getStatusColor = (state: string) => {
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

const getPhaseLabel = (phase: string) => {
  switch (phase) {
    case 'queued':
      return 'Na Fila'
    case 'scraping':
      return 'Extraindo Dados'
    case 'completed':
      return 'Concluído'
    case 'failed':
      return 'Falhou'
    default:
      return 'Desconhecido'
  }
}

export const JobProgress: React.FC<JobProgressProps> = ({
  status,
  isLoading,
  error,
  isCompleted,
  isFailed,
  progress,
  message,
}) => {
  if (!status) {
    return null
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          {getStatusIcon(status.state, isLoading)}
          Job #{status.jobId}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <Badge className={getStatusColor(status.state)}>
            {getPhaseLabel(status.phase)}
          </Badge>

          <span className="text-sm text-gray-500">{progress}%</span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-gray-600">{message}</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-md bg-red-50 p-3">
            <div className="flex">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Result Summary */}
        {isCompleted && status.result && (
          <div className="rounded-md bg-green-50 p-3">
            <div className="flex">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Processamento concluído!
                </p>
                {status.result.data && (
                  <p className="text-xs text-green-700 mt-1">
                    {status.result.data.products?.length || 0} produtos
                    extraídos
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Failed Summary */}
        {isFailed && (
          <div className="rounded-md bg-red-50 p-3">
            <div className="flex">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  Processamento falhou
                </p>
                {status.failedReason && (
                  <p className="text-xs text-red-700 mt-1">
                    {status.failedReason}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="text-xs text-gray-500 space-y-1">
          {status.timestamp && (
            <p>Criado: {new Date(status.timestamp).toLocaleString()}</p>
          )}
          {status.processedOn && (
            <p>Iniciado: {new Date(status.processedOn).toLocaleString()}</p>
          )}
          {status.finishedOn && (
            <p>Finalizado: {new Date(status.finishedOn).toLocaleString()}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
