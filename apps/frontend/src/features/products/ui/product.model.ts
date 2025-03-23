import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { ViewMode } from './products.type'
import { useQuery } from '@tanstack/react-query'
import { columns } from './components/columns'
import { apiClient } from '@/api/client'

export const useProductModel = () => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [viewMode, setViewMode] = useState<ViewMode | null>(
    (localStorage.getItem('viewMode') as ViewMode) || 'table',
  )

  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: () => apiClient.get('/products').then((res) => res.data),
  })

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

  return {
    table,
    productsQuery,
    viewMode,
    handleViewMode,
  }
}
