'use client'

import { useState } from 'react'
import {
  Bell,
  Check,
  Clock,
  AlertTriangle,
  CheckCircle,
  Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: string
  read: boolean
  action?: {
    label: string
    url: string
  }
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Produto com estoque baixo',
    message: 'O produto "Arroz Integral" está com estoque baixo (5 unidades)',
    type: 'warning',
    timestamp: '2min',
    read: false,
    action: {
      label: 'Ver produto',
      url: '/products',
    },
  },
  {
    id: '2',
    title: 'Scraping concluído',
    message: 'Scraping de produtos foi concluído com sucesso',
    type: 'success',
    timestamp: '15min',
    read: false,
    action: {
      label: 'Ver resultados',
      url: '/scraping',
    },
  },
  {
    id: '3',
    title: 'Backup automático',
    message: 'Backup do banco de dados foi realizado com sucesso',
    type: 'info',
    timestamp: '1h',
    read: true,
  },
  {
    id: '4',
    title: 'Erro de conexão',
    message: 'Falha na conexão com o serviço de scraping',
    type: 'error',
    timestamp: '2h',
    read: false,
  },
]

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return CheckCircle
    case 'warning':
      return AlertTriangle
    case 'error':
      return AlertTriangle
    case 'info':
    default:
      return Info
  }
}

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return 'bg-green-500'
    case 'warning':
      return 'bg-yellow-500'
    case 'error':
      return 'bg-red-500'
    case 'info':
    default:
      return 'bg-blue-500'
  }
}

interface NotificationsDropdownProps {
  className?: string
}

export function NotificationsDropdown({
  className,
}: NotificationsDropdownProps) {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications)
  const [open, setOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }

    if (notification.action?.url) {
      console.log('Navegar para:', notification.action.url)
    }

    setOpen(false)
  }

  const formatTimestamp = (timestamp: string) => {
    return timestamp
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn('relative', className)}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notificações</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificações
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} não lidas
              </Badge>
            )}
          </span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={markAllAsRead}
            >
              Marcar todas como lidas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="max-h-64 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type)
              const colorClass = getNotificationColor(notification.type)

              return (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    'flex flex-col items-start p-3 cursor-pointer',
                    !notification.read && 'bg-muted/50',
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3 w-full">
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full mt-2 flex-shrink-0',
                        colorClass,
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon
                          className={cn('h-4 w-4', {
                            'text-green-600': notification.type === 'success',
                            'text-yellow-600': notification.type === 'warning',
                            'text-red-600': notification.type === 'error',
                            'text-blue-600': notification.type === 'info',
                          })}
                        />
                        <span
                          className={cn('text-sm font-medium truncate', {
                            'font-semibold': !notification.read,
                          })}
                        >
                          {notification.title}
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto flex-shrink-0">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {notification.message}
                      </p>
                      {notification.action && (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs text-primary mt-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            console.log('Ação:', notification.action?.url)
                          }}
                        >
                          {notification.action.label} →
                        </Button>
                      )}
                    </div>
                  </div>
                </DropdownMenuItem>
              )
            })
          ) : (
            <div className="flex flex-col items-center gap-2 py-6 text-center">
              <Bell className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Nenhuma notificação
              </p>
              <p className="text-xs text-muted-foreground">
                Você está em dia com tudo!
              </p>
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-sm">
              Ver todas as notificações
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
