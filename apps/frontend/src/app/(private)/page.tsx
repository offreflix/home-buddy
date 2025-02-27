'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Package,
  Utensils,
} from 'lucide-react'

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/features/products/ui/product-main'
import { Product } from '@/features/products/model/types'

export function LoadingProductCard({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        {children}
      </CardHeader>
      <CardContent>
        <div className="h-8 w-24 bg-muted rounded-md animate-pulse" />
        <div className="mt-2 h-4 w-40 bg-muted rounded-md animate-pulse" />
      </CardContent>
    </Card>
  )
}

export interface Count {
  count: number
}

export default function Home() {
  const lowStockQuery = useQuery<Product[]>({
    queryKey: ['low-stock'],
    queryFn: () => apiClient.get('/products/low-stock').then((res) => res.data),
  })

  const countQuery = useQuery<Count>({
    queryKey: ['count'],
    queryFn: () => apiClient.get('/products/count').then((res) => res.data),
  })

  const data = {
    totalProducts: 1500,
    totalProductsLastMonth: 1400,
    productsInShortage: 45,
    mostConsumedProduct: {
      name: 'Farinha de Trigo',
      quantity: 320,
      unit: 'kg',
      quantityLastMonth: 290,
    },
    totalProductsChange: 7.14,
    shortageChange: 5,
    consumptionChange: 10.34,
  }

  console.log(lowStockQuery.data)
  console.log(countQuery.data)

  function PercentageChange({ value }: { value: number }) {
    if (value === 0) return null
    const Icon = value > 0 ? ArrowUp : ArrowDown
    return (
      <span
        className={`flex items-center ${
          value > 0 ? 'text-green-500' : 'text-red-500'
        }`}
      >
        <Icon className="w-4 h-4 mr-1" />
        {Math.abs(value).toFixed(1)}%
      </span>
    )
  }

  return (
    <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
      {!countQuery.isLoading ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Produtos
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{countQuery.data?.count}</div>
            {data.totalProductsLastMonth > 0 ? (
              <CardDescription className="flex items-center text-xs">
                <PercentageChange value={data.totalProductsChange} />
                <span className="ml-1">em relação ao mês passado</span>
              </CardDescription>
            ) : (
              <CardDescription>Sem comparação disponível</CardDescription>
            )}
          </CardContent>
        </Card>
      ) : (
        <LoadingProductCard>
          <CardTitle className="text-sm font-medium">
            Total de Produtos
          </CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </LoadingProductCard>
      )}

      {!lowStockQuery.isLoading ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Produtos em Falta
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lowStockQuery.data?.length}
            </div>
            {data.productsInShortage > 0 ? (
              <CardDescription className="flex items-center text-xs">
                <PercentageChange value={-data.shortageChange} />
                <span className="ml-1">em relação ao mês passado</span>
              </CardDescription>
            ) : (
              <CardDescription>Sem produtos em falta</CardDescription>
            )}
          </CardContent>
        </Card>
      ) : (
        <LoadingProductCard>
          <CardTitle className="text-sm font-medium">
            Produtos em Falta
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </LoadingProductCard>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Produto Mais Consumido
          </CardTitle>
          <Utensils className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.mostConsumedProduct.name}
          </div>
          <CardDescription className="text-xs">
            {data.mostConsumedProduct.quantity} {data.mostConsumedProduct.unit}{' '}
            consumidos
          </CardDescription>
          {data.mostConsumedProduct.quantityLastMonth > 0 ? (
            <CardDescription className="flex items-center text-xs">
              <PercentageChange value={data.consumptionChange} />
              <span className="ml-1">em relação ao mês passado</span>
            </CardDescription>
          ) : (
            <CardDescription>Sem comparação disponível</CardDescription>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
