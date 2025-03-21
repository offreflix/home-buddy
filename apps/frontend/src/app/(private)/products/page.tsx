'use server'

import { getUserProfile } from '@/features/auth/model/authActions'
import { DeleteProductDialog } from '@/features/products/ui/delete-product-dialog'
import { ProductMain } from '@/features/products/ui/product-main'
import { QuantityDialog } from '@/features/products/ui/quantity-dialog'
import { UpdateProductDialog } from '@/features/products/ui/update-product-dialog'
import type { Metadata } from 'next'

// export const metadata: Metadata = {
//   title: 'Gestão de Produtos | Home Buddy',
//   description: 'Gerencie seu estoque de produtos de forma eficiente',
//   keywords: 'produtos, estoque, gestão, ecommerce',
//   openGraph: {
//     type: 'website',
//     locale: 'pt_BR',
//     url: 'https://home-buddy-zeta.vercel.app',
//   },
// }

export default async function Page() {
  return (
    <div className="p-8 flex flex-col gap-4">
      <UpdateProductDialog />

      <DeleteProductDialog />

      <QuantityDialog />

      <ProductMain />
    </div>
  )
}
