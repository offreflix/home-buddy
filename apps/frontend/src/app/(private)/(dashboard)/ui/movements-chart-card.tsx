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
import { LoadingProductCard } from '@/app/(private)/(dashboard)/_products'
import { apiClient } from '@/api/client'
import dayjs from 'dayjs'
import { Skeleton } from '@/components/ui/skeleton'
import { AxiosResponse } from 'axios'

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
  const startDate = dayjs().startOf('day').format('YYYY-MM-DD')
  const endDate = dayjs().endOf('month').format('YYYY-MM-DD')

  console.log(startDate, endDate)

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

  console.log(movementsQuery.data)

  if (movementsQuery.isLoading) {
    return (
      <Card className="col-span-2">
        <CardHeader className="pb-0">
          <CardTitle className="text-sm font-medium">
            <Skeleton className="h-5 w-40" />
          </CardTitle>
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
