import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { columns } from './ui/components/columns'
import { apiClient } from '@/api/client'
import {
  ViewMode,
  ProductFilters,
  Product,
  PaginatedResponse,
  PaginationParams,
} from './products.type'
import { filterProductsByStock } from './utils/stock-utils'

export const useProductModel = () => {
  const queryClient = useQueryClient()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [viewMode, setViewMode] = useState<ViewMode | null>(
    (localStorage.getItem('viewMode') as ViewMode) || 'table',
  )
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    categoryId: 'all',
    stockStatus: 'all',
    unit: 'all',
  })

  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    perPage: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })

  const productsQuery = useQuery({
    queryKey: ['products', pagination],
    queryFn: () =>
      apiClient
        .get('/products', { params: pagination })
        .then((res) => res.data),
  })

  const filteredProducts = useMemo(() => {
    if (!productsQuery.data?.data) return []

    let filtered = productsQuery.data.data as Product[]

    if (filters.search) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(filters.search.toLowerCase())),
      )
    }

    if (filters.categoryId !== 'all') {
      filtered = filtered.filter(
        (product) => product.categoryId.toString() === filters.categoryId,
      )
    }

    if (filters.stockStatus !== 'all') {
      filtered = filterProductsByStock(filtered, filters.stockStatus)
    }

    if (filters.unit !== 'all') {
      filtered = filtered.filter((product) => product.unit === filters.unit)
    }

    return filtered
  }, [productsQuery.data, filters])

  const table = useReactTable({
    data: filteredProducts,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
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

  function handleFiltersChange(newFilters: ProductFilters) {
    setFilters(newFilters)
  }

  function handleClearFilters() {
    setFilters({
      search: '',
      categoryId: 'all',
      stockStatus: 'all',
      unit: 'all',
    })
  }

  function handlePaginationChange(newPagination: Partial<PaginationParams>) {
    setPagination((prev) => ({ ...prev, ...newPagination }))
  }

  function handlePageChange(page: number) {
    setPagination((prev) => ({ ...prev, page }))
  }

  function handlePerPageChange(perPage: number) {
    setPagination((prev) => ({ ...prev, perPage, page: 1 }))
  }

  function handleSortingChange(sortBy: string, sortOrder: 'asc' | 'desc') {
    setPagination((prev) => ({ ...prev, sortBy, sortOrder, page: 1 }))
  }

  const bulkDeleteMutation = useMutation({
    mutationFn: (productIds: number[]) =>
      Promise.all(productIds.map((id) => apiClient.delete(`/products/${id}`))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setRowSelection({})
    },
  })

  const bulkCategoryChangeMutation = useMutation({
    mutationFn: ({
      productIds,
      categoryId,
    }: {
      productIds: number[]
      categoryId: number
    }) =>
      Promise.all(
        productIds.map((id) =>
          apiClient.put(`/products/${id}`, { categoryId }),
        ),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setRowSelection({})
    },
  })

  function handleSelectAll() {
    table.toggleAllPageRowsSelected(true)
  }

  function handleDeselectAll() {
    table.toggleAllPageRowsSelected(false)
    setRowSelection({})
  }

  function handleBulkDelete(productIds: number[]) {
    bulkDeleteMutation.mutate(productIds)
  }

  function handleBulkCategoryChange(productIds: number[], categoryId: number) {
    bulkCategoryChangeMutation.mutate({ productIds, categoryId })
  }

  function handleBulkExport(products: Product[]) {
    const csvData = products.map((product) => ({
      Nome: product.name,
      Descrição: product.description || '',
      Categoria: product.category.name,
      Unidade: product.unit,
      'Quantidade Atual': product.stock?.currentQuantity || 0,
      'Quantidade Desejada': product.stock?.desiredQuantity || 0,
      'Data de Criação': product.createdAt,
    }))

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map((row) => Object.values(row).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute(
      'download',
      `produtos_${new Date().toISOString().split('T')[0]}.csv`,
    )
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const selectedProducts = filteredProducts.filter((_, index) =>
    table.getRowModel().rows[index]?.getIsSelected(),
  )

  const allSelected = table.getIsAllPageRowsSelected()

  const paginationData = productsQuery.data as
    | PaginatedResponse<Product>
    | undefined

  return {
    table,
    productsQuery,
    viewMode,
    handleViewMode,
    filters,
    handleFiltersChange,
    handleClearFilters,
    filteredProducts,
    selectedProducts,
    allSelected,
    handleSelectAll,
    handleDeselectAll,
    handleBulkDelete,
    handleBulkCategoryChange,
    handleBulkExport,
    bulkDeleteMutation,
    bulkCategoryChangeMutation,
    pagination: paginationData?.meta,
    paginationLinks: paginationData?.links,
    handlePaginationChange,
    handlePageChange,
    handlePerPageChange,
    handleSortingChange,
  }
}
