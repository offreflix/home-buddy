'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Utensils } from 'lucide-react'
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
import React from 'react'
import { Movements } from '@/entities/product/types'
import { LoadingProductCard } from '@/app/(private)/_products'
import { apiClient } from '@/api/client'

const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  IN: {
    label: 'Entrada',
    color: 'hsl(var(--chart-5))',
  },
  OUT: {
    label: 'Saída',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

export function MovementsChart() {
  const movementsQuery = useQuery<Movements[]>({
    queryKey: ['movements'],
    queryFn: () =>
      apiClient
        .get(`/products/movements?startDate=2025-03-01&endDate=2025-03-31`)
        .then((res) => res.data),
  })

  console.log(movementsQuery.data)

  if (movementsQuery.isLoading) {
    return (
      <LoadingProductCard className="col-span-2">
        <CardTitle className="text-sm font-medium">
          Produto Mais Consumido
        </CardTitle>
        <Utensils className="h-4 w-4 text-muted-foreground" />
      </LoadingProductCard>
    )
  }

  return (
    <Card className="col-span-2">
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-medium">
          Movimentações por Mês
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={movementsQuery.data}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
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
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
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
                const [year, month, day] = value.split('-').map(Number)
                const date = new Date(year, month - 1, day)
                return date.toLocaleDateString('pt-BR', {
                  month: 'short',
                  day: 'numeric',
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    const [year, month, day] = value.split('-').map(Number)
                    const date = new Date(year, month - 1, day)
                    return date.toLocaleDateString('pt-BR', {
                      month: 'short',
                      day: 'numeric',
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="IN"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-OUT)"
            />
            <Area
              dataKey="OUT"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-IN)"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
