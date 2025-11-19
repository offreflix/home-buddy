'use client'

import { useState, useEffect } from 'react'
import {
  Wifi,
  WifiOff,
  Server,
  Database,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { apiClient } from '@/api/client'
import { getErrorCode } from '@/lib/api-error'

interface SystemStatus {
  id: string
  name: string
  status: 'online' | 'offline' | 'warning' | 'error'
  lastCheck: Date
  responseTime?: number
  icon: React.ComponentType<{ className?: string }>
  details?: string
}

interface SystemStatusProps {
  className?: string
}

export function SystemStatus({ className }: SystemStatusProps) {
  const [systemStatuses, setSystemStatuses] = useState<SystemStatus[]>([
    {
      id: 'api',
      name: 'API Backend',
      status: 'offline',
      lastCheck: new Date(),
      icon: Server,
    },
    {
      id: 'database',
      name: 'Banco de Dados',
      status: 'offline',
      lastCheck: new Date(),
      icon: Database,
    },
    {
      id: 'sync',
      name: 'Sincronização',
      status: 'offline',
      lastCheck: new Date(),
      icon: Clock,
    },
  ])
  const [isChecking, setIsChecking] = useState(false)
  const [lastFullCheck, setLastFullCheck] = useState<Date>(new Date())

  const getStatusColor = (status: SystemStatus['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-500'
      case 'warning':
        return 'bg-yellow-500'
      case 'error':
        return 'bg-red-500'
      case 'offline':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: SystemStatus['status']) => {
    switch (status) {
      case 'online':
        return CheckCircle
      case 'warning':
        return AlertTriangle
      case 'error':
        return XCircle
      case 'offline':
        return WifiOff
      default:
        return Clock
    }
  }

  const getStatusText = (status: SystemStatus['status']) => {
    switch (status) {
      case 'online':
        return 'Online'
      case 'warning':
        return 'Atenção'
      case 'error':
        return 'Erro'
      case 'offline':
        return 'Offline'
      default:
        return 'Desconhecido'
    }
  }

  const checkApiStatus = async (): Promise<{
    status: 'online' | 'offline' | 'warning' | 'error'
    responseTime?: number
    details?: string
  }> => {
    const startTime = Date.now()
    try {
      const response = await apiClient.get('/health', { timeout: 5000 })
      const responseTime = Date.now() - startTime

      if (response.status === 200) {
        return {
          status:
            responseTime < 100
              ? 'online'
              : responseTime < 500
                ? 'warning'
                : 'error',
          responseTime,
          details: `Uptime: ${Math.floor(response.data.uptime / 60)}min`,
        }
      }
      return { status: 'warning', details: `Status: ${response.status}` }
    } catch (error: unknown) {
      const errorCode = getErrorCode(error)
      return {
        status: 'offline',
        details: errorCode === 'ECONNABORTED' ? 'Timeout' : 'Erro de conexão',
      }
    }
  }

  const checkDatabaseStatus = async (): Promise<{
    status: 'online' | 'offline' | 'warning' | 'error'
    responseTime?: number
    details?: string
  }> => {
    const startTime = Date.now()
    try {
      const response = await apiClient.get('/products/count', { timeout: 5000 })
      const responseTime = Date.now() - startTime

      if (response.status === 200) {
        return {
          status:
            responseTime < 100
              ? 'online'
              : responseTime < 500
                ? 'warning'
                : 'error',
          responseTime,
          details: `Produtos: ${response.data.count || 0}`,
        }
      }
      return { status: 'warning', details: `Status: ${response.status}` }
    } catch (error: unknown) {
      const errorCode = getErrorCode(error)
      return {
        status: 'offline',
        details: errorCode === 'ECONNABORTED' ? 'Timeout' : 'Erro de conexão',
      }
    }
  }

  const checkSyncStatus = async (): Promise<{
    status: 'online' | 'offline' | 'warning' | 'error'
    responseTime?: number
    details?: string
  }> => {
    const startTime = Date.now()
    try {
      const response = await apiClient.get('/scrapping/queue/stats', {
        timeout: 5000,
      })
      const responseTime = Date.now() - startTime

      if (response.status === 200) {
        const stats = response.data
        const hasActiveJobs = (stats.active || 0) > 0
        const hasFailedJobs = (stats.failed || 0) > 0

        let status: 'online' | 'warning' | 'error' = 'online'
        if (hasFailedJobs) status = 'error'
        else if (hasActiveJobs) status = 'warning'

        return {
          status,
          responseTime,
          details: `Ativos: ${stats.active || 0}, Falharam: ${stats.failed || 0}`,
        }
      }
      return { status: 'warning', details: `Status: ${response.status}` }
    } catch (error: unknown) {
      const errorCode = getErrorCode(error)
      return {
        status: 'offline',
        details: errorCode === 'ECONNABORTED' ? 'Timeout' : 'Erro de conexão',
      }
    }
  }

  const checkAllStatuses = async () => {
    setIsChecking(true)
    try {
      const [apiStatus, dbStatus, syncStatus] = await Promise.all([
        checkApiStatus(),
        checkDatabaseStatus(),
        checkSyncStatus(),
      ])

      setSystemStatuses([
        {
          id: 'api',
          name: 'API Backend',
          status: apiStatus.status,
          lastCheck: new Date(),
          responseTime: apiStatus.responseTime,
          icon: Server,
          details: apiStatus.details,
        },
        {
          id: 'database',
          name: 'Banco de Dados',
          status: dbStatus.status,
          lastCheck: new Date(),
          responseTime: dbStatus.responseTime,
          icon: Database,
          details: dbStatus.details,
        },
        {
          id: 'sync',
          name: 'Sincronização',
          status: syncStatus.status,
          lastCheck: new Date(),
          responseTime: syncStatus.responseTime,
          icon: Clock,
          details: syncStatus.details,
        },
      ])

      setLastFullCheck(new Date())
    } catch (error) {
      console.error('Erro ao verificar status do sistema:', error)
    } finally {
      setIsChecking(false)
    }
  }

  const formatLastCheck = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))

    if (minutes < 1) return 'Agora'
    if (minutes < 60) return `${minutes}min atrás`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h atrás`

    const days = Math.floor(hours / 24)
    return `${days}d atrás`
  }

  useEffect(() => {
    checkAllStatuses()

    const interval = setInterval(() => {
      checkAllStatuses()
    }, 30000) // Atualiza a cada 30 segundos

    return () => clearInterval(interval)
  }, [])

  const overallStatus = systemStatuses.every((s) => s.status === 'online')
    ? 'online'
    : systemStatuses.some((s) => s.status === 'error')
      ? 'error'
      : 'warning'

  return (
    <TooltipProvider>
      <div className={cn('flex items-center gap-2', className)}>
        {/* Status geral do sistema */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1">
              <div
                className={cn(
                  'w-2 h-2 rounded-full',
                  getStatusColor(overallStatus),
                )}
              />
              <span className="text-xs text-muted-foreground hidden xl:inline">
                Sistema
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-center">
              <p className="font-medium">Status do Sistema</p>
              <p className="text-xs text-muted-foreground">
                {getStatusText(overallStatus)}
              </p>
            </div>
          </TooltipContent>
        </Tooltip>

        {/* Separador */}
        <div className="w-px h-4 bg-border hidden lg:block" />

        {/* Status dos serviços principais */}
        <div className="hidden lg:flex items-center gap-3">
          {systemStatuses.map((status) => (
            <Tooltip key={status.id}>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-pointer">
                  <status.icon className="h-3 w-3 text-muted-foreground" />
                  <div
                    className={cn(
                      'w-1.5 h-1.5 rounded-full',
                      getStatusColor(status.status),
                    )}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-center">
                  <p className="font-medium">{status.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {getStatusText(status.status)}
                  </p>
                  {status.responseTime && (
                    <p className="text-xs text-muted-foreground">
                      {status.responseTime}ms
                    </p>
                  )}
                  {status.details && (
                    <p className="text-xs text-muted-foreground">
                      {status.details}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Última verificação: {formatLastCheck(status.lastCheck)}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Botão de refresh manual */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={checkAllStatuses}
              disabled={isChecking}
              className="flex items-center gap-1 p-1 rounded hover:bg-accent transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={cn(
                  'h-3 w-3 text-muted-foreground',
                  isChecking && 'animate-spin',
                )}
              />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-center">
              <p className="font-medium">Verificar Status</p>
              <p className="text-xs text-muted-foreground">
                Última verificação: {formatLastCheck(lastFullCheck)}
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
