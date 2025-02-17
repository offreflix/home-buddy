import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Minus, Plus, MoreVertical, ShoppingCart, Trash2 } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { Product } from '../model/types'
import { productIndexedDbService } from '../api/indexed-db.service'
import { queryClient } from '@/lib/react-query'
import { useModalStore } from '../stores/modal.store'
import { transformProductToFormSchema } from './columns'

type Props = {
  data: Array<Product> | undefined
}

function ProductCard({ data }: Props) {
  const decreaseQuantity = async (id: number) => {
    await productIndexedDbService.decreaseQuantity(id)

    queryClient.invalidateQueries({ queryKey: ['products'] })
  }

  const increaseQuantity = async (id: number) => {
    await productIndexedDbService.addQuantity(id)

    queryClient.invalidateQueries({ queryKey: ['products'] })
  }

  const {
    toggleEditModal,
    setEditingProduct,
    toggleDeleteModal,
    setDeletingProductId,
  } = useModalStore()

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data?.map((product) => (
        <Card key={product.id} className="rounded-lg overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg font-semibold mb-1">
                  {product.name}
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {product.category.name}
                </Badge>
              </div>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      toggleEditModal()
                      setEditingProduct(transformProductToFormSchema(product))
                    }}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" /> Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      toggleDeleteModal()
                      setDeletingProductId(product.id)
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>Quantidade</span>
                <span className="font-medium">
                  {product.stock.currentQuantity} /{' '}
                  {product.stock.desiredQuantity} {product.unit}
                </span>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Progress
                      value={
                        (product.stock.currentQuantity /
                          product.stock.desiredQuantity) *
                        100
                      }
                      className="h-2"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {(
                        (product.stock.currentQuantity /
                          product.stock.desiredQuantity) *
                        100
                      ).toFixed()}
                      % do desejado
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <div className="flex items-center justify-between w-full">
              <Button
                variant="outline"
                size="icon"
                onClick={() => decreaseQuantity(product.id)}
                className="h-8 w-8 rounded-full"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-lg font-semibold">
                {product.stock.currentQuantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => increaseQuantity(product.id)}
                className="h-8 w-8 rounded-full"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export default ProductCard
