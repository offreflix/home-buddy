'use client'

import { ChevronDown, LayoutGrid, List, PlusCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import ProductCard from './components/product-card'
import ProductTable from './components/product-table'
import ProductCardSkeleton from './components/product-card-skeleton'
import { DataTableSkeleton } from './components/product-table-skeleton'
import { AdvancedFilters } from './components/advanced-filters'
import { BulkActions } from './components/bulk-actions'
import { SmartSuggestions } from './components/smart-suggestions'
import { useProductModel } from '../product.model'
import { useModalStore } from '../modal.store'

type ProductViewProps = ReturnType<typeof useProductModel>

export function ProductMain(props: ProductViewProps) {
  const {
    table,
    handleViewMode,
    viewMode,
    productsQuery,
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
  } = props
  const { toggleAddModal } = useModalStore()

  const handleQuickRestock = (productId: number, suggestedQuantity: number) => {
    console.log('Reposição rápida:', productId, suggestedQuantity)
  }

  return (
    <div className="w-full flex flex-col gap-4 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col">
          <p className="text-lg font-bold">
            Produtos
            {table.getIsSomePageRowsSelected() && (
              <span className="text-sm text-muted-foreground">
                {' '}
                - {table.getFilteredSelectedRowModel().rows.length}{' '}
                selecionado(s)
              </span>
            )}
          </p>
          <span className="text-sm text-muted-foreground">
            {filteredProducts.length} produto
            {filteredProducts.length !== 1 ? 's' : ''}
            {productsQuery.data &&
              filteredProducts.length !== productsQuery.data.length &&
              ` de ${productsQuery.data.length} total`}
          </span>
        </div>

        <Button onClick={toggleAddModal} className="w-full sm:w-auto">
          <PlusCircle className="h-4 w-4" />
          Adicionar Produto
        </Button>
      </div>

      {/* Filtros Avançados */}
      <AdvancedFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {/* Ações em Massa - apenas para modo tabela */}
      {viewMode === 'table' && (
        <BulkActions
          selectedProducts={selectedProducts}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          onBulkDelete={handleBulkDelete}
          onBulkCategoryChange={handleBulkCategoryChange}
          onBulkExport={handleBulkExport}
          totalProducts={filteredProducts.length}
          allSelected={allSelected}
        />
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 order-2 sm:order-1">
          {viewMode === 'table' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Colunas <ChevronDown className="h-4 w-4" />
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
          )}
        </div>

        <div className="flex items-center gap-2 order-1 sm:order-2">
          <span className="text-sm text-muted-foreground hidden sm:inline">
            Visualização:
          </span>
          <div className="border rounded-lg flex">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleViewMode('card')}
              className={`${viewMode === 'card' ? 'bg-accent' : ''}`}
              title="Visualização em cards"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleViewMode('table')}
              className={`${viewMode === 'table' ? 'bg-accent' : ''}`}
              title="Visualização em tabela"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {productsQuery.isLoading &&
        (viewMode === 'card' ? <ProductCardSkeleton /> : <DataTableSkeleton />)}

      {!productsQuery.isLoading &&
        (viewMode === 'card' ? (
          <ProductCard data={filteredProducts} />
        ) : (
          <ProductTable table={table} isLoading={productsQuery.isLoading} />
        ))}

      {/* Insights da Despensa (com alertas integrados) */}
      {!productsQuery.isLoading && filteredProducts.length > 0 && (
        <div className="mt-6">
          <SmartSuggestions
            products={filteredProducts}
            onQuickRestock={handleQuickRestock}
          />
        </div>
      )}
    </div>
  )
}
