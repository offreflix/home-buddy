'use client'

import { ChevronDown, LayoutGrid, List, PlusCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'

import ProductCard from './components/product-card'
import ProductTable from './components/product-table'
import ProductCardSkeleton from './components/product-card-skeleton'
import { DataTableSkeleton } from './components/product-table-skeleton'
import { useProductModel } from '../model/product.model'
import { useModalStore } from '../stores/modal.store'

type ProductViewProps = ReturnType<typeof useProductModel>

export function ProductMain(props: ProductViewProps) {
  const { table, handleViewMode, viewMode, productsQuery } = props
  const { toggleAddModal } = useModalStore()

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

        <Button onClick={toggleAddModal}>
          <PlusCircle />
          Adicionar Produto
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <Input
          placeholder="Filtrar nome..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <div className="flex items-center gap-2">
          {viewMode === 'table' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
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
          )}

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
      </div>

      {productsQuery.isLoading &&
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
