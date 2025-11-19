'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import React, { useState } from 'react'
import { Movements } from '@/entities/product/types'
import { apiClient } from '@/api/client'
import dayjs from 'dayjs'
import { Skeleton } from '@/components/ui/skeleton'
import { AxiosResponse } from 'axios'
import { ArrowUp, ArrowDown, Info, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  IN: {
    label: 'Entrada',
    color: 'var(--chart-5)',
  },
  OUT: {
    label: 'Saída',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

type PeriodFilter = 'last-3-months' | 'last-30-days' | 'last-7-days'

const periodOptions = [
  { value: 'last-3-months' as PeriodFilter, label: 'Últimos 3 Meses' },
  { value: 'last-30-days' as PeriodFilter, label: 'Últimos 30 Dias' },
  { value: 'last-7-days' as PeriodFilter, label: 'Últimos 7 Dias' },
]

const getDateRange = (period: PeriodFilter) => {
  const now = dayjs()

  switch (period) {
    case 'last-3-months':
      return {
        startDate: now
          .subtract(3, 'month')
          .startOf('month')
          .format('YYYY-MM-DD'),
        endDate: now.endOf('month').format('YYYY-MM-DD'),
      }
    case 'last-30-days':
      return {
        startDate: now.subtract(30, 'day').format('YYYY-MM-DD'),
        endDate: now.format('YYYY-MM-DD'),
      }
    case 'last-7-days':
      return {
        startDate: now.subtract(7, 'day').format('YYYY-MM-DD'),
        endDate: now.format('YYYY-MM-DD'),
      }
    default:
      return {
        startDate: now
          .subtract(3, 'month')
          .startOf('month')
          .format('YYYY-MM-DD'),
        endDate: now.endOf('month').format('YYYY-MM-DD'),
      }
  }
}

export function MovementsChart() {
  const [selectedPeriod, setSelectedPeriod] =
    useState<PeriodFilter>('last-3-months')
  const { startDate, endDate } = getDateRange(selectedPeriod)

  const movementsQuery = useQuery<Movements[]>({
    queryKey: ['movements', startDate, endDate],
    queryFn: () =>
      apiClient
        .get(`/products/movements?startDate=${startDate}&endDate=${endDate}`)
        .then((res: AxiosResponse<Movements[]>) =>
          res.data.map((movement) => ({
            ...movement,
            date: dayjs(movement.date).format('YYYY-MM-DD'),
          })),
        ),
  })

  const hasEnoughData = (movementsQuery.data?.length || 0) >= 2

  if (movementsQuery.isLoading) {
    return (
      <Card className="col-span-2">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              <Skeleton className="h-5 w-40" />
            </CardTitle>
            <ToggleGroup
              type="single"
              value={selectedPeriod}
              onValueChange={(value: PeriodFilter) =>
                value && setSelectedPeriod(value)
              }
              className="bg-muted rounded-md p-1"
            >
              {periodOptions.map((option) => (
                <ToggleGroupItem
                  key={option.value}
                  value={option.value}
                  className="px-3 py-1 text-xs font-medium data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm"
                >
                  {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="space-y-3">
            <div className="aspect-auto h-[250px] w-full rounded-md">
              <div className="flex h-full w-full flex-col">
                <div className="relative flex-1">
                  <Skeleton className="h-full w-full" />
                </div>

                <div className="mt-2 flex justify-between px-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-12" />
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-2">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            Movimentações por Período
          </CardTitle>
          <ToggleGroup
            type="single"
            value={selectedPeriod}
            onValueChange={(value: PeriodFilter) =>
              value && setSelectedPeriod(value)
            }
            className="border"
          >
            {periodOptions.map((option) => (
              <ToggleGroupItem
                key={option.value}
                value={option.value}
                className="text-xs data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm"
              >
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {!hasEnoughData ? (
          <div className="space-y-6">
            {movementsQuery.data?.map((item, index) => (
              <div key={index} className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {dayjs(item.date).format('DD [de] MMMM [de] YYYY')}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Card de Entradas */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Entradas
                          </p>
                          <p className="text-2xl font-bold">{item.IN}</p>
                        </div>
                        <ArrowUp className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card de Saídas */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Saídas
                          </p>
                          <p className="text-2xl font-bold">{item.OUT}</p>
                        </div>
                        <ArrowDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Saldo líquido */}
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground">
                        Saldo Líquido
                      </p>
                      <p className="text-xl font-bold">
                        {(item.IN || 0) - (item.OUT || 0) > 0 ? '+' : ''}
                        {(item.IN || 0) - (item.OUT || 0)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}

            {/* Mensagem informativa */}
            <Card className="border border-border bg-muted/50 p-3 flex items-center justify-between">
              <CardContent className="p-0">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Adicione mais movimentações para visualizar o gráfico de
                    tendência ao longo do tempo.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={movementsQuery.data}>
              <defs>
                <linearGradient id="fillIN" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-IN)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-IN)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillOUT" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-OUT)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-OUT)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  return dayjs(value).format('DD/MMM')
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return dayjs(value).format('DD [de] MMMM [de] YYYY')
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="IN"
                type="natural"
                fill="url(#fillIN)"
                stroke="var(--color-IN)"
              />
              <Area
                dataKey="OUT"
                type="natural"
                fill="url(#fillOUT)"
                stroke="var(--color-OUT)"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}

        {/* Resumo estatístico (sempre visível) */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-sm font-medium text-muted-foreground">
                Total Entradas
              </div>
              <div className="text-2xl font-bold">
                {movementsQuery.data?.reduce(
                  (sum, item) => sum + (item.IN || 0),
                  0,
                ) || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-sm font-medium text-muted-foreground">
                Total Saídas
              </div>
              <div className="text-2xl font-bold">
                {movementsQuery.data?.reduce(
                  (sum, item) => sum + (item.OUT || 0),
                  0,
                ) || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-sm font-medium text-muted-foreground">
                Períodos
              </div>
              <div className="text-2xl font-bold">
                {movementsQuery.data?.length || 0}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
