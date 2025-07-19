'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Product } from '@/app/(private)/products/products.type'
import React from 'react'
import { LoadingProductCard } from '@/app/(private)/(dashboard)/_products'
import { apiClient } from '@/api/client'

export function LowStockProductsCard() {
  const lowStockQuery = useQuery<Product[]>({
    queryKey: ['low-stock'],
    queryFn: () => apiClient.get('/products/low-stock').then((res) => res.data),
  })

  if (lowStockQuery.isLoading) {
    return (
      <LoadingProductCard>
        <CardTitle className="text-sm font-medium">Produtos em Falta</CardTitle>
        <AlertTriangle className="h-4 w-4 text-red-500" />
      </LoadingProductCard>
    )
  }

  if (lowStockQuery.isError) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Produtos em Falta
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <CardDescription className="text-xs text-red-500">
            Erro ao carregar produtos em falta.
          </CardDescription>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Produtos em Falta</CardTitle>
        <AlertTriangle className="h-4 w-4 text-red-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{lowStockQuery.data?.length}</div>
      </CardContent>
    </Card>
  )
}
