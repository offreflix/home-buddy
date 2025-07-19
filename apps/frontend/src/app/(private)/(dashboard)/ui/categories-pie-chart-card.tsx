'use client'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { Skeleton } from '@/components/ui/skeleton'

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

  if (countByCategoryQuery.isLoading) {
    return (
      <Card className="col-span-2 lg:col-span-1">
        <CardHeader className="pb-0">
          <CardTitle className="text-sm font-medium">
            <Skeleton className="h-5 w-64" />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="mx-auto aspect-square max-h-[250px] flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              <Skeleton className="aspect-square w-[180px] h-[180px] rounded-full" />
              <div className="absolute bg-card w-[80px] h-[80px] rounded-full" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-4 w-full flex justify-center">
          <div className="grid grid-cols-2 gap-5">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="text-xs flex items-center justify-center gap-2"
              >
                <Skeleton className="h-2 w-2 shrink-0 rounded-[2px]" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-2 w-2 shrink-0 rounded-[2px]" />
              </div>
            ))}
          </div>
        </CardFooter>
      </Card>
    )
  }

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
              innerRadius={40}
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
      <CardFooter className="pt-4 w-full flex justify-center">
        <div className="grid grid-cols-2 gap-1">
          {countByCategoryQuery.data &&
            countByCategoryQuery.data.map((category, index) => (
              <div
                key={category.name}
                className="flex items-center justify-between gap-2 text-xs w-full h-full p-2"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 shrink-0 rounded-[2px]"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="truncate block max-w-[100px] 2xl:max-w-[160px]">
                    {category.name}
                  </span>
                </div>
                <span
                  className="font-medium"
                  style={{ color: COLORS[index % COLORS.length] }}
                >
                  {category.count}
                </span>
              </div>
            ))}
        </div>
      </CardFooter>
    </Card>
  )
}
