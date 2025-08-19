'use client'

import { CreateProductDialog } from './ui/modal/create-product-dialog'
import { DeleteProductDialog } from './ui/modal/delete-product-dialog'
import { ProductMain } from './ui/product-main'
import { useProductModel } from './product.model'
import { QuantityDialog } from './ui/modal/quantity-dialog'
import { UpdateProductDialog } from './ui/update-product-dialog'

export function ProductsView() {
  const { ...methods } = useProductModel()

  return (
    <div className="flex flex-col min-h-full">
      {/* Modais */}
      <UpdateProductDialog />
      <DeleteProductDialog />
      <QuantityDialog />
      <CreateProductDialog />

      {/* Conteúdo principal */}
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <ProductMain {...methods} />
      </div>
    </div>
  )
}
