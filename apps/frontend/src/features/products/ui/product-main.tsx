'use client'

import {
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronDown, LayoutGrid, List } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'

import { columns } from './columns'

import { useQuery } from '@tanstack/react-query'
import { CreateProductDialog } from './create-product-dialog'

import ProductCard from './product-card'
import { useEffect, useState } from 'react'
import ProductTable from './product-table'
import ProductCardSkeleton from './product-card-skeleton'
import { DataTableSkeleton } from './product-table-skeleton'
import axios from 'axios'
import Router from 'next/router'
import { refreshToken } from '@/features/auth/model/authActions'
import { QuantityDialog } from './quantity-dialog'

type ViewMode = 'card' | 'table'

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL,
  withCredentials: true,
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        await refreshToken()

        return apiClient(originalRequest)
      } catch (refreshError) {
        Router.push('/login')
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export function ProductMain() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [viewMode, setViewMode] = useState<ViewMode | null>(null)

  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: () => apiClient.get('/products').then((res) => res.data),
  })

  useEffect(() => {
    const viewMode = localStorage.getItem('viewMode') as ViewMode

    setViewMode(viewMode || 'table')
  }, [])

  const table = useReactTable({
    data: productsQuery.data ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  function handleViewMode(mode: ViewMode) {
    setViewMode(mode)
    localStorage.setItem('viewMode', mode)
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold">
          Produtos
          {table.getIsSomePageRowsSelected() && (
            <span className="text-sm text-muted-foreground">
              {' '}
              - {table.getFilteredSelectedRowModel().rows.length} selecionado(s)
            </span>
          )}
        </p>

        <CreateProductDialog />
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Filtrar nome..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Colunas <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="border rounded-lg flex">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleViewMode('card')}
            className={`${viewMode === 'card' ? 'bg-accent' : ''}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleViewMode('table')}
            className={`${viewMode === 'table' ? 'bg-accent' : ''}`}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode &&
        productsQuery.isLoading &&
        (viewMode === 'card' ? <ProductCardSkeleton /> : <DataTableSkeleton />)}

      {!productsQuery.isLoading &&
        (viewMode === 'card' ? (
          <ProductCard data={productsQuery.data} />
        ) : (
          <ProductTable table={table} isLoading={productsQuery.isLoading} />
        ))}
    </div>
  )
}
