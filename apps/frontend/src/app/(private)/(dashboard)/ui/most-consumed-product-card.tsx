'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ArrowDown, ArrowUp, Utensils } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import React from 'react'
import { MostConsumed } from '@/entities/product/types'
import { LoadingProductCard } from '@/app/(private)/(dashboard)/_products'
import { apiClient } from '@/api/client'

function PercentageChange({ value }: { value?: number }) {
  if (!value) return null
  const Icon = value > 0 ? ArrowUp : ArrowDown
  return (
    <span
      className={`flex items-center ${value > 0 ? 'text-green-500' : 'text-red-500'}`}
    >
      <Icon className="w-4 h-4 mr-1" />
      {Math.abs(value).toFixed(1)}%
    </span>
  )
}

export function MostConsumedProductCard() {
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()

  const mostConsumedQuery = useQuery<MostConsumed>({
    queryKey: ['most-consumed', currentMonth, currentYear],
    queryFn: () =>
      apiClient
        .get(
          `/products/most-consumed?month=${currentMonth}&year=${currentYear}`,
        )
        .then((res) => res.data),
  })

  if (mostConsumedQuery.isLoading) {
    return (
      <LoadingProductCard>
        <CardTitle className="text-sm font-medium">
          Produto Mais Consumido
        </CardTitle>
        <Utensils className="h-4 w-4 text-muted-foreground" />
      </LoadingProductCard>
    )
  }

  if (mostConsumedQuery.isError || !mostConsumedQuery.data?.product) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Produto Mais Consumido
          </CardTitle>
          <Utensils className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <CardDescription className="text-xs">
            Nenhum produto encontrado neste mês
          </CardDescription>
        </CardContent>
      </Card>
    )
  }

  const { product, quantity, unit, percentageChange } = mostConsumedQuery.data

  return (
    <Card className="col-span-2 lg:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Produto Mais Consumido
        </CardTitle>
        <Utensils className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{product}</div>
        <CardDescription className="text-xs">
          {quantity} {unit} consumidos
        </CardDescription>
        {percentageChange !== 0 ? (
          <CardDescription className="flex items-center text-xs">
            <PercentageChange value={percentageChange} />
            <span className="ml-1">em relação ao mês passado</span>
          </CardDescription>
        ) : (
          <CardDescription>Sem comparação disponível</CardDescription>
        )}
      </CardContent>
    </Card>
  )
}
