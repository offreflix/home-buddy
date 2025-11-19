import * as React from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Minus, MoreHorizontal, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { MovementType, useModalStore } from '../../modal.store'
import { FormSchema } from '../update-product-dialog'
import { Product, Unit } from '../../products.type'
import { StockStatusBadge } from './stock-status-badge'
import { SortableHeader } from './sortable-header'

interface ColumnsProps {
  onSortingChange: (sortBy: string) => void
  currentSortBy: string
  currentSortOrder: 'asc' | 'desc'
}

export const createColumns = ({
  onSortingChange,
  currentSortBy,
  currentSortOrder,
}: ColumnsProps): ColumnDef<Product>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: () => (
      <SortableHeader
        label="Nome"
        sortBy="name"
        currentSortBy={currentSortBy}
        currentSortOrder={currentSortOrder}
        onSortingChange={onSortingChange}
      />
    ),
    cell: ({ row }) => <div className="pl-4">{row.getValue('name')}</div>,
  },
  {
    accessorFn: (row: Product) => row.stock?.currentQuantity || 0,
    id: 'quantity',
    header: () => (
      <SortableHeader
        label="Quantidade"
        sortBy="stock.currentQuantity"
        currentSortBy={currentSortBy}
        currentSortOrder={currentSortOrder}
        onSortingChange={onSortingChange}
      />
    ),
    cell: ({ row }) => {
      const stock = row.original.stock

      if (!stock) {
        return <div>0</div>
      }

      const { toggleQuantityModal, setMovementType, setSelectedProductId } =
        useModalStore()

      const handleQuantityChange = (type: MovementType, productId: number) => {
        setMovementType(type)
        setSelectedProductId(productId)
        toggleQuantityModal()
      }

      return (
        <div className="flex items-center space-x-2 pl-4">
          <div className="w-[120px] space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <StockStatusBadge
                currentQuantity={stock.currentQuantity}
                desiredQuantity={stock.desiredQuantity}
                showIcon={false}
              />
            </div>
            <Progress
              value={Math.min(
                (stock.currentQuantity / stock.desiredQuantity) * 100,
                100,
              )}
            />

            <div className="text-xs text-muted-foreground">
              {stock.currentQuantity} / {stock.desiredQuantity}{' '}
              {row.original.unit}
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              handleQuantityChange(MovementType.OUT, row.original.id)
            }
          >
            <Minus />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              handleQuantityChange(MovementType.IN, row.original.id)
            }}
          >
            <Plus />
          </Button>
        </div>
      )
    },
  },
  {
    accessorFn: (row: Product) => row.category.name,
    id: 'category',
    header: () => (
      <SortableHeader
        label="Categoria"
        sortBy="category.name"
        currentSortBy={currentSortBy}
        currentSortOrder={currentSortOrder}
        onSortingChange={onSortingChange}
      />
    ),
    cell: ({ row }) => (
      <div className="pl-4">
        <Badge variant="secondary" className="text-xs font-medium">
          {row.getValue('category')}
        </Badge>
      </div>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const {
        toggleEditModal,
        setEditingProduct,
        toggleDeleteModal,
        setSelectedProductId,
        toggleViewModal,
        setViewingProduct,
      } = useModalStore()

      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-9 w-9 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                toggleViewModal()
                setViewingProduct(row.original)
              }}
            >
              Visualizar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                toggleEditModal()
                setEditingProduct(transformProductToFormSchema(row.original))
              }}
            >
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                toggleDeleteModal()
                setSelectedProductId(row.original.id)
              }}
            >
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export const transformProductToFormSchema = (product: Product): FormSchema => {
  return {
    id: product.id,
    name: product.name,
    description: product.description || undefined,
    unit: product.unit as Unit,
    categoryId: product.category.id,
    currentQuantity: product.stock?.currentQuantity || 0,
    desiredQuantity: product.stock?.desiredQuantity || 0,
  }
}
