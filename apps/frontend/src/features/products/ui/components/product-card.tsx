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
import { MovementType, useModalStore } from '../../stores/modal.store'
import { transformProductToFormSchema } from './columns'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { EmptyState } from '@/components/empty-state'
import { Product } from '../../model/products.type'

type Props = {
  data: Array<Product> | undefined
}

function ProductCard({ data }: Props) {
  const {
    toggleEditModal,
    setEditingProduct,
    toggleDeleteModal,
    setSelectedProductId,
    toggleQuantityModal,
    setMovementType,
    toggleAddModal,
  } = useModalStore()

  const handleQuantityChange = (type: MovementType, productId: number) => {
    setMovementType(type)
    setSelectedProductId(productId)
    toggleQuantityModal()
  }

  if (!data || data.length === 0) {
    return <EmptyState onClick={toggleAddModal} />
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data?.map((product) => (
        <Card
          key={product.id}
          className={cn(
            'flex flex-col',
            'border',
            'hover:border-primary/30',
            'transition-all duration-200',
            'shadow-sm backdrop-blur-xl',
          )}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg font-semibold mb-1">
                  {product.name}
                </CardTitle>
                <Badge variant="secondary" className="text-xs font-medium">
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
                      setSelectedProductId(product.id)
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
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <div className="flex items-center justify-between w-full">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  handleQuantityChange(MovementType.OUT, product.id)
                }
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
                onClick={() =>
                  handleQuantityChange(MovementType.IN, product.id)
                }
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
