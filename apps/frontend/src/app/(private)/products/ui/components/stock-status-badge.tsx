'use client'

import { Badge } from '@/components/ui/badge'
import {
  AlertTriangle,
  TrendingDown,
  CheckCircle,
  TrendingUp,
} from 'lucide-react'
import {
  getStockStatus,
  getStockStatusColor,
  getStockStatusLabel,
} from '../../utils/stock-utils'
import { cn } from '@/lib/utils'

interface StockStatusBadgeProps {
  currentQuantity: number
  desiredQuantity: number
  className?: string
  showIcon?: boolean
}

export function StockStatusBadge({
  currentQuantity,
  desiredQuantity,
  className,
  showIcon = true,
}: StockStatusBadgeProps) {
  const status = getStockStatus(currentQuantity, desiredQuantity)
  const color = getStockStatusColor(status)
  const label = getStockStatusLabel(status)

  const getIcon = () => {
    if (!showIcon) return null

    switch (status) {
      case 'critical':
        return <AlertTriangle className="h-3 w-3" />
      case 'low':
        return <TrendingDown className="h-3 w-3" />
      case 'adequate':
        return <CheckCircle className="h-3 w-3" />
      case 'high':
        return <TrendingUp className="h-3 w-3" />
      default:
        return null
    }
  }

  const getBadgeVariant = () => {
    switch (status) {
      case 'critical':
        return 'destructive' as const
      case 'low':
        return 'secondary' as const
      case 'adequate':
        return 'default' as const
      case 'high':
        return 'default' as const
      default:
        return 'default' as const
    }
  }

  return (
    <Badge
      variant={getBadgeVariant()}
      className={cn(
        'flex items-center gap-1 text-xs font-medium',
        status === 'critical' &&
          'bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:border-red-600 dark:text-red-100',
        status === 'low' &&
          'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:border-yellow-600 dark:text-yellow-100',
        status === 'adequate' &&
          'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:border-green-600 dark:text-green-100',
        status === 'high' &&
          'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-100',
        className,
      )}
    >
      {getIcon()}
      {label}
    </Badge>
  )
}
