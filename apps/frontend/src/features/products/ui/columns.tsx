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
import { useModalStore } from '../stores/modal.store'
import { productIndexedDbService } from '../api/indexed-db.service'
import { useQueryClient } from '@tanstack/react-query'
import { Badge } from '@/components/ui/badge'
import { FormSchema } from './update-product-dialog'

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
      const queryClient = useQueryClient()
      const { currentQuantity, desiredQuantity } = row.original.stock

      return (
        <div className="flex items-center space-x-2 pl-4">
          <div className="w-[100px] space-y-1">
            <Progress value={(currentQuantity / desiredQuantity) * 100} />
            <div className="text-xs text-muted-foreground">
              {currentQuantity} / {desiredQuantity} {row.original.unit}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={async () => {
              await productIndexedDbService.decreaseQuantity(row.original.id)
              queryClient.invalidateQueries({ queryKey: ['products'] })
            }}
          >
            <Minus />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={async () => {
              await productIndexedDbService.addQuantity(row.original.id)
              queryClient.invalidateQueries({ queryKey: ['products'] })
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
        <Badge variant="secondary" className="text-xs">
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
        setDeletingProductId,
      } = useModalStore()

      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 w-9 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                console.log(row.original)
                toggleEditModal()
                setEditingProduct(transformProductToFormSchema(row.original))
              }}
            >
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                toggleDeleteModal()
                setDeletingProductId(row.original.id)
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
  console.log(product)

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
