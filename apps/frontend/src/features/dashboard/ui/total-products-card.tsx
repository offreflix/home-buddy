'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Package } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import React from 'react'
import { Count } from '@/entities/product/types'
import { LoadingProductCard } from '@/app/(private)/_products'
import { apiClient } from '@/api/client'

export function TotalProductsCard() {
  const countQuery = useQuery<Count>({
    queryKey: ['count'],
    queryFn: () => apiClient.get('/products/count').then((res) => res.data),
  })

  if (countQuery.isLoading) {
    return (
      <LoadingProductCard>
        <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
        <Package className="h-4 w-4 text-muted-foreground" />
      </LoadingProductCard>
    )
  }

  if (countQuery.isError) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Produtos
          </CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <CardDescription className="text-xs text-red-500">
            Erro ao carregar total de produtos.
          </CardDescription>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
        <Package className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{countQuery.data?.count}</div>
      </CardContent>
    </Card>
  )
}
