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
    <div className="p-8 flex flex-col gap-4">
      <UpdateProductDialog />

      <DeleteProductDialog />

      <QuantityDialog />

      <CreateProductDialog />

      <ProductMain {...methods} />
    </div>
  )
}
