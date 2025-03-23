'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Cell, Pie, PieChart } from 'recharts'
import React from 'react'
import { CountByCategory } from '@/entities/product/types'

const chartConfig = {
  count: {
    label: 'Quantidade',
  },
  graos: {
    label: 'Grãos e Cereais',
    color: 'hsl(var(--chart-1))',
  },
  proteinas: {
    label: 'Proteínas',
    color: 'hsl(var(--chart-2))',
  },
  laticinios: {
    label: 'Laticínios',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig

export function CategoriesPieChart() {
  const countByCategoryQuery = useQuery<CountByCategory[]>({
    queryKey: ['most-consumed'],
    queryFn: () =>
      apiClient.get(`/products/count-by-category`).then((res) => res.data),
  })

  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
    'hsl(var(--chart-6))',
    'hsl(var(--chart-7))',
  ]

  return (
    <Card className="col-span-2 lg:col-span-1">
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-medium">
          Distribuição de Produtos por Categoria
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={countByCategoryQuery.data}
              dataKey="count"
              nameKey="name"
              stroke="0"
            >
              {countByCategoryQuery.data &&
                countByCategoryQuery.data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing total visitors for the last 6 months
          </div>
        </CardFooter> */}
    </Card>
  )
}
