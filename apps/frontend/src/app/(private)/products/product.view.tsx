'use client'

import { CreateProductDialog } from '@/features/products/ui/modal/create-product-dialog'
import { DeleteProductDialog } from '@/features/products/ui/modal/delete-product-dialog'
import { ProductMain } from '@/features/products/ui/product-main'
import { useProductModel } from '@/features/products/ui/product.model'
import { QuantityDialog } from '@/features/products/ui/modal/quantity-dialog'
import { UpdateProductDialog } from '@/features/products/ui/update-product-dialog'

export function ProductView() {
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
