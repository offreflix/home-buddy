'use client'

import {
  Plus,
  Download,
  Upload,
  RefreshCw,
  BarChart3,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { apiClient } from '@/api/client'
import { toast } from 'sonner'
import { useState } from 'react'
import { useModalStore } from '@/app/(private)/products/modal.store'
import { useRouter } from 'next/navigation'

interface QuickAction {
  id: string
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  action: () => void | Promise<void>
  variant?: 'default' | 'secondary' | 'outline'
  badge?: string
  loading?: boolean
}

interface QuickActionsProps {
  className?: string
}

export function QuickActions({ className }: QuickActionsProps) {
  const { toggleAddModal } = useModalStore()
  const router = useRouter()
  const [loadingActions, setLoadingActions] = useState<Set<string>>(new Set())

  const setActionLoading = (actionId: string, loading: boolean) => {
    setLoadingActions((prev) => {
      const newSet = new Set(prev)
      if (loading) {
        newSet.add(actionId)
      } else {
        newSet.delete(actionId)
      }
      return newSet
    })
  }

  const handleNewProduct = () => {
    toggleAddModal()
  }

  const handleExport = async () => {
    try {
      setActionLoading('export', true)
      toast.info('Preparando exportação...')

      const response = await apiClient.get('/export/products', {
        responseType: 'blob',
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
        `produtos_${new Date().toISOString().split('T')[0]}.csv`,
      )
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      toast.success('Exportação concluída com sucesso!')
    } catch (error) {
      console.error('Erro ao exportar:', error)
      toast.error('Erro ao exportar dados')
    } finally {
      setActionLoading('export', false)
    }
  }

  const handleReports = async () => {
    try {
      setActionLoading('reports', true)
      toast.info('Gerando relatório...')

      const response = await apiClient.get('/export/reports/stock-summary')
      const report = response.data

      console.log('Relatório gerado:', report)
      toast.success('Relatório gerado com sucesso!')

      alert(`Relatório de Estoque:
Total de produtos: ${report.summary.totalProducts}
Produtos com baixo estoque: ${report.summary.lowStockProducts}
Produtos sem estoque: ${report.summary.outOfStockProducts}
Total de categorias: ${report.summary.totalCategories}
Quantidade total em estoque: ${report.summary.totalStockQuantity}
Quantidade desejada total: ${report.summary.totalDesiredQuantity}`)
    } catch (error) {
      console.error('Erro ao gerar relatório:', error)
      toast.error('Erro ao gerar relatório')
    } finally {
      setActionLoading('reports', false)
    }
  }

  const handleRefresh = () => {
    window.location.reload()
    toast.info('Atualizando página...')
  }

  const handleScraping = () => {
    router.push('/scraping')
  }

  const quickActions: QuickAction[] = [
    {
      id: 'new-product',
      label: 'Novo Produto',
      description: 'Adicionar produto ao estoque',
      icon: Plus,
      action: handleNewProduct,
      variant: 'default',
    },
    {
      id: 'scraping',
      label: 'Scraping',
      description: 'Extrair dados de notas fiscais',
      icon: Download,
      action: handleScraping,
      variant: 'outline',
    },
    {
      id: 'export',
      label: 'Exportar',
      description: 'Exportar dados do sistema',
      icon: Upload,
      action: handleExport,
      variant: 'outline',
      loading: loadingActions.has('export'),
    },
    {
      id: 'refresh',
      label: 'Atualizar',
      description: 'Sincronizar dados',
      icon: RefreshCw,
      action: handleRefresh,
      variant: 'outline',
    },
    {
      id: 'reports',
      label: 'Relatórios',
      description: 'Gerar relatórios',
      icon: BarChart3,
      action: handleReports,
      variant: 'outline',
      badge: 'Novo',
      loading: loadingActions.has('reports'),
    },
  ]

  const handleAction = async (action: QuickAction) => {
    if (action.loading) return
    await action.action()
  }

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Ações Rápidas</span>
            <span className="sm:hidden">Ações</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Ações Rápidas</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {quickActions.map((action) => (
            <DropdownMenuItem
              key={action.id}
              onClick={() => handleAction(action)}
              className="flex items-center gap-2 p-2"
              disabled={action.loading}
            >
              <div className="relative">
                <action.icon className="h-4 w-4" />
                {action.loading && (
                  <div className="absolute -top-1 -right-1 h-3 w-3">
                    <div className="animate-spin rounded-full h-3 w-3 border-2 border-primary border-t-transparent"></div>
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="flex items-center gap-2">
                  {action.label}
                  {action.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {action.badge}
                    </Badge>
                  )}
                  {action.loading && (
                    <span className="text-xs text-muted-foreground">
                      (carregando...)
                    </span>
                  )}
                </span>
                <span className="text-xs text-muted-foreground">
                  {action.description}
                </span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
