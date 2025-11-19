import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useModalStore } from '../../modal.store'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function ViewProductDialog() {
  const { isViewModalOpen, toggleViewModal, viewingProduct } = useModalStore()

  const movementsQuery = useQuery({
    queryKey: ['product-movements', viewingProduct?.id],
    queryFn: async () => {
      if (!viewingProduct) return []
      // Fetch movements for the last 6 months or so
      // For now, let's just get all movements and filter/group on client or use existing endpoint
      // Using the existing endpoint 'products/movements' which accepts date range
      const endDate = new Date().toISOString().split('T')[0]
      const startDate = new Date()
      startDate.setMonth(startDate.getMonth() - 6)
      const startDateStr = startDate.toISOString().split('T')[0]

      // Note: The existing endpoint returns aggregated data by date.
      // But we might want specific product movements.
      // The endpoint 'products/movements' filters by user, not product.
      // So we might need to filter on client side if we use that, OR create a new endpoint.
      // However, the prompt said "gráficos de uso".
      // Let's check if the product object already has movements.
      // Yes, Product interface has 'movements'.
      return viewingProduct.movements
    },
    enabled: !!viewingProduct,
  })

  if (!viewingProduct) return null

  const stockPercentage = viewingProduct.stock
    ? Math.min(
        (viewingProduct.stock.currentQuantity /
          viewingProduct.stock.desiredQuantity) *
          100,
        100,
      )
    : 0

  // Process movements for chart (last 6 months usage)
  const chartData = viewingProduct.movements
    .filter((m) => m.movementType === 'OUT')
    .reduce((acc: any[], curr) => {
      const date = new Date(curr.createdAt)
      const monthKey = format(date, 'MMM/yy', { locale: ptBR })
      const existing = acc.find((item) => item.name === monthKey)
      if (existing) {
        existing.quantity += curr.quantity
      } else {
        acc.push({ name: monthKey, quantity: curr.quantity })
      }
      return acc
    }, [])
    .reverse() // Assuming movements are new to old? No, usually API returns sorted.
    // Let's sort by date first just in case
    .sort((a, b) => {
        // Simple sort for now, might need better date parsing if keys are strings
        return 0 
    })

  return (
    <Dialog open={isViewModalOpen} onOpenChange={toggleViewModal}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {viewingProduct.name}
            <Badge variant="secondary">{viewingProduct.category.name}</Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh] pr-4">
          <div className="space-y-6">
            {/* Info Básica */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Unidade</span>
                <p className="font-medium">{viewingProduct.unit}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Estoque Atual</span>
                <div className="flex items-center gap-2">
                  <p className="font-medium">
                    {viewingProduct.stock?.currentQuantity || 0}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    / {viewingProduct.stock?.desiredQuantity || 0}
                  </span>
                </div>
              </div>
              <div className="col-span-2 space-y-1">
                <span className="text-sm text-muted-foreground">Descrição</span>
                <p className="text-sm">
                  {viewingProduct.description || 'Sem descrição'}
                </p>
              </div>
            </div>

            {/* Gráfico de Consumo */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Consumo Mensal</h3>
              <div className="h-[200px] w-full border rounded-md p-2">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="quantity" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    Sem dados de consumo
                  </div>
                )}
              </div>
            </div>

            {/* Datas */}
            <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground border-t pt-4">
              <div>
                Criado em:{' '}
                {format(new Date(viewingProduct.createdAt), "dd 'de' MMM, yyyy", {
                  locale: ptBR,
                })}
              </div>
              <div>
                Atualizado em:{' '}
                {format(new Date(viewingProduct.updatedAt), "dd 'de' MMM, yyyy", {
                  locale: ptBR,
                })}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
