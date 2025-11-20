'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useModalStore } from '../../modal.store'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { useQuery } from '@tanstack/react-query'
import { Product } from '../../products.type'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  TrendingUp,
  Package,
  Calendar,
  Scale,
  AlertCircle,
  ArrowDown,
  ArrowUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { subDays, subMonths, isAfter, startOfDay } from 'date-fns'
import { useState } from 'react'

type PeriodFilter = 'last-3-months' | 'last-30-days' | 'last-7-days'

const periodOptions = [
  { value: 'last-3-months' as PeriodFilter, label: 'Últimos 3 Meses' },
  { value: 'last-30-days' as PeriodFilter, label: 'Últimos 30 Dias' },
  { value: 'last-7-days' as PeriodFilter, label: 'Últimos 7 Dias' },
]

export function ViewProductDialog() {
  const { isViewModalOpen, toggleViewModal, viewingProduct } = useModalStore()
  const [selectedPeriod, setSelectedPeriod] =
    useState<PeriodFilter>('last-3-months')

  const movementsQuery = useQuery({
    queryKey: ['product-movements', viewingProduct?.id],
    queryFn: async () => {
      if (!viewingProduct) return []

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

  interface ChartDataItem {
    name: string
    IN: number
    OUT: number
    date: Date
  }

  const chartConfig = {
    IN: {
      label: 'Entradas',
      color: 'hsl(var(--chart-2))',
    },
    OUT: {
      label: 'Saídas',
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig

  const getStartDate = (period: PeriodFilter) => {
    const now = new Date()
    switch (period) {
      case 'last-3-months':
        return subMonths(now, 3)
      case 'last-30-days':
        return subDays(now, 30)
      case 'last-7-days':
        return subDays(now, 7)
      default:
        return subMonths(now, 3)
    }
  }

  const chartData = viewingProduct.movements
    .filter((m: Product['movements'][0]) => {
      const movementDate = new Date(m.createdAt)
      return isAfter(movementDate, startOfDay(getStartDate(selectedPeriod)))
    })
    .reduce((acc: ChartDataItem[], curr: Product['movements'][0]) => {
      const date = new Date(curr.createdAt)
      let dateFormat = 'MMM/yy'
      if (
        selectedPeriod === 'last-30-days' ||
        selectedPeriod === 'last-7-days'
      ) {
        dateFormat = 'dd/MM'
      }

      const dateKey = format(date, dateFormat, { locale: ptBR })
      const existing = acc.find((item) => item.name === dateKey)

      if (existing) {
        if (curr.movementType === 'IN') {
          existing.IN += curr.quantity
        } else {
          existing.OUT += curr.quantity
        }
      } else {
        acc.push({
          name: dateKey,
          IN: curr.movementType === 'IN' ? curr.quantity : 0,
          OUT: curr.movementType === 'OUT' ? curr.quantity : 0,
          date,
        })
      }
      return acc
    }, [])
    .sort(
      (a: ChartDataItem, b: ChartDataItem) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
    )

  const totalOutput = chartData.reduce(
    (sum: number, item: ChartDataItem) => sum + item.OUT,
    0,
  )
  const totalInput = chartData.reduce(
    (sum: number, item: ChartDataItem) => sum + item.IN,
    0,
  )

  const getStockStatus = () => {
    if (!viewingProduct.stock) return { label: 'Sem dados', color: 'bg-muted' }
    if (stockPercentage > 75)
      return {
        label: 'Estoque Ótimo',
        color:
          'bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/20',
        icon: <ArrowUp className="size-3.5" />,
      }
    if (stockPercentage > 50)
      return {
        label: 'Estoque Bom',
        color:
          'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20',
        icon: <ArrowUp className="size-3.5" />,
      }
    if (stockPercentage > 25)
      return {
        label: 'Estoque Baixo',
        color:
          'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
        icon: <AlertCircle className="size-3.5" />,
      }
    return {
      label: 'Estoque Crítico',
      color: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20',
      icon: <ArrowDown className="size-3.5" />,
    }
  }

  const stockStatus = getStockStatus()

  return (
    <Dialog open={isViewModalOpen} onOpenChange={toggleViewModal}>
      <DialogContent className="sm:max-w-[700px] p-0 gap-0 overflow-hidden border-border/50 shadow-xl">
        <DialogHeader className="px-6 py-6 border-b bg-muted/10">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <DialogTitle className="flex items-center gap-3 text-2xl font-bold tracking-tight">
                <span className="text-balance">{viewingProduct.name}</span>
              </DialogTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary" className="rounded-md px-2.5 py-0.5">
                  {viewingProduct.category.name}
                </Badge>
                <span className="text-muted-foreground/40">•</span>
                <span className="flex items-center gap-1">
                  <Scale className="size-3.5" />
                  {viewingProduct.unit}
                </span>
              </div>
            </div>
            <Badge
              variant="outline"
              className={cn(
                'flex items-center gap-1.5 px-3 py-1 text-sm font-medium border',
                stockStatus.color,
              )}
            >
              {stockStatus.icon}
              {stockStatus.label}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh]">
          <div className="px-6 py-6 space-y-8">
            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Estoque Card */}
              <div className="col-span-1 md:col-span-2 space-y-4 rounded-xl border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Package className="size-4 text-primary" />
                    Controle de Estoque
                  </h3>
                  <span className="text-xs font-medium text-muted-foreground">
                    {stockPercentage.toFixed(0)}% da meta
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-end justify-between">
                    <div className="flex flex-col">
                      <span className="text-3xl font-bold tracking-tight">
                        {viewingProduct.stock?.currentQuantity || 0}
                        <span className="text-base font-normal text-muted-foreground ml-1">
                          {viewingProduct.unit}
                        </span>
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Quantidade Atual
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-lg font-semibold text-muted-foreground">
                        {viewingProduct.stock?.desiredQuantity || 0}
                        <span className="text-xs font-normal ml-1">
                          {viewingProduct.unit}
                        </span>
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Meta Desejada
                      </span>
                    </div>
                  </div>

                  <div className="relative h-3 w-full rounded-full bg-secondary overflow-hidden">
                    <div
                      className={cn(
                        'h-full transition-all duration-500 ease-out rounded-full',
                        stockPercentage > 75
                          ? 'bg-green-500'
                          : stockPercentage > 25
                            ? 'bg-primary'
                            : 'bg-red-500',
                      )}
                      style={{ width: `${stockPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Descrição */}
              <div className="col-span-1 md:col-span-2 space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Descrição
                </h4>
                <p className="text-sm leading-relaxed text-foreground/80 p-4 rounded-lg border bg-card shadow-sm">
                  {viewingProduct.description ||
                    'Nenhuma descrição fornecida para este produto.'}
                </p>
              </div>
            </div>

            <Separator />

            {/* Gráfico de Movimentações */}
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <TrendingUp className="size-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold">
                      Histórico de Movimentações
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Entradas e saídas no período
                    </p>
                  </div>
                </div>
                <ToggleGroup
                  type="single"
                  value={selectedPeriod}
                  onValueChange={(value: PeriodFilter) =>
                    value && setSelectedPeriod(value)
                  }
                  className="bg-muted/50 rounded-lg p-1 border"
                >
                  {periodOptions.map((option) => (
                    <ToggleGroupItem
                      key={option.value}
                      value={option.value}
                      className="h-7 px-2.5 text-xs font-medium data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm"
                    >
                      {option.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>

              {/* Métricas */}
              {chartData.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border bg-card p-3 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        Total Entradas
                      </p>
                      <ArrowUp className="size-3 text-green-500" />
                    </div>
                    <p className="text-lg font-bold text-foreground">
                      {totalInput}{' '}
                      <span className="text-xs font-normal text-muted-foreground">
                        {viewingProduct.unit}
                      </span>
                    </p>
                  </div>
                  <div className="rounded-xl border bg-card p-3 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        Total Saídas
                      </p>
                      <ArrowDown className="size-3 text-red-500" />
                    </div>
                    <p className="text-lg font-bold text-foreground">
                      {totalOutput}{' '}
                      <span className="text-xs font-normal text-muted-foreground">
                        {viewingProduct.unit}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              <div className="rounded-xl border bg-card/50 p-1">
                <div className="h-[300px] w-full p-4">
                  {chartData.length > 0 ? (
                    <ChartContainer
                      config={chartConfig}
                      className="h-full w-full"
                    >
                      <BarChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="hsl(var(--border))"
                          vertical={false}
                          opacity={0.5}
                        />
                        <XAxis
                          dataKey="name"
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                          stroke="hsl(var(--muted-foreground))"
                          dy={10}
                        />
                        <YAxis
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                          stroke="hsl(var(--muted-foreground))"
                          dx={-10}
                        />
                        <ChartTooltip
                          cursor={{ fill: 'hsl(var(--muted)/0.5)', radius: 4 }}
                          content={
                            <ChartTooltipContent
                              indicator="dashed"
                              labelClassName="text-muted-foreground"
                            />
                          }
                        />
                        <Bar
                          dataKey="IN"
                          fill="var(--color-IN)"
                          radius={[4, 4, 0, 0]}
                          maxBarSize={40}
                        />
                        <Bar
                          dataKey="OUT"
                          fill="var(--color-OUT)"
                          radius={[4, 4, 0, 0]}
                          maxBarSize={40}
                        />
                      </BarChart>
                    </ChartContainer>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                      <div className="rounded-full bg-muted p-3">
                        <TrendingUp className="size-6 text-muted-foreground/50" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          Sem dados de movimentação
                        </p>
                        <p className="text-xs text-muted-foreground max-w-[200px]">
                          Adicione movimentações para visualizar o gráfico.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="border-t bg-muted/10 px-6 py-4">
          <div className="grid grid-cols-2 gap-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-background rounded-md border shadow-sm">
                <Calendar className="size-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  Criado em
                </span>
                <span className="text-sm font-medium text-foreground">
                  {format(
                    new Date(viewingProduct.createdAt),
                    "dd 'de' MMM, yyyy",
                    {
                      locale: ptBR,
                    },
                  )}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-background rounded-md border shadow-sm">
                <Calendar className="size-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  Atualizado em
                </span>
                <span className="text-sm font-medium text-foreground">
                  {format(
                    new Date(viewingProduct.updatedAt),
                    "dd 'de' MMM, yyyy",
                    {
                      locale: ptBR,
                    },
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
