'use client'

import { CreateProductDialog } from './ui/modal/create-product-dialog'
import { DeleteProductDialog } from './ui/modal/delete-product-dialog'
import { ProductMain } from './ui/product-main'
import { useProductModel } from './product.model'
import { QuantityDialog } from './ui/modal/quantity-dialog'
import { UpdateProductDialog } from './ui/update-product-dialog'
import { useState } from 'react'

export function ProductsView() {
  const { ...methods } = useProductModel()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
        <p className="text-muted-foreground">
          Gerencie seu catálogo de produtos e estoque
        </p>
      </div>

      <ProductMain {...methods} />

      {/* Modais */}
      <UpdateProductDialog />
      <DeleteProductDialog />
      <QuantityDialog />
    </div>
  )
}
