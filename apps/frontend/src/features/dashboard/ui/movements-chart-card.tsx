'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Utensils } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/features/products/ui/product-main'
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
  // const [timeRange, setTimeRange] = React.useState('90d')

  const movementsQuery = useQuery<Movements[]>({
    queryKey: ['movements'],
    queryFn: () =>
      apiClient
        .get(`/products/movements?startDate=2025-03-01&endDate=2025-03-31`)
        .then((res) => res.data),
  })

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

  // const filteredData = movementsQuery.data?.filter((item) => {
  //   const date = new Date(item.date)
  //   const referenceDate = new Date('2024-06-30')
  //   let daysToSubtract = 90
  //   if (timeRange === '30d') {
  //     daysToSubtract = 30
  //   } else if (timeRange === '7d') {
  //     daysToSubtract = 7
  //   }
  //   const startDate = new Date(referenceDate)
  //   startDate.setDate(startDate.getDate() - daysToSubtract)
  //   return date >= startDate
  // })

  return (
    <Card className="col-span-2">
      {/* className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row" */}
      <CardHeader className="pb-0">
        {/* <div className="grid flex-1 gap-1 text-center sm:text-left"> */}
        <CardTitle className="text-sm font-medium">
          Movimentações por Mês
        </CardTitle>
        {/* <CardDescription>
              Showing total visitors for the last 3 months
            </CardDescription>
          </div> */}
        {/* <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="w-[160px] rounded-lg sm:ml-auto"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select> */}
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
                const date = new Date(value)
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
                    return new Date(value).toLocaleDateString('pt-BR', {
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
