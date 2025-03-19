import * as React from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Minus, MoreHorizontal, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import type { Product, Unit } from '../model/types'
import { MovementType, useModalStore } from '../stores/modal.store'
import { Badge } from '@/components/ui/badge'
import { FormSchema } from './update-product-dialog'
import { toast } from 'sonner'

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Nome
        <ArrowUpDown className="ml-2" />
      </Button>
    ),
    cell: ({ row }) => <div className="pl-4">{row.getValue('name')}</div>,
  },
  {
    accessorFn: (row: Product) => row.stock.currentQuantity,
    id: 'quantity',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Quantidade
        <ArrowUpDown className="ml-2" />
      </Button>
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
          <div className="w-[100px] space-y-1">
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
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Categoria
        <ArrowUpDown className="ml-2" />
      </Button>
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
    description: product.description,
    unit: product.unit as Unit,
    categoryId: product.category.id,
    currentQuantity: product.stock.currentQuantity,
    desiredQuantity: product.stock.desiredQuantity,
  }
}
