'use server'

import React from 'react'
import { MostConsumedProductCard } from '@/features/dashboard/ui/most-consumed-product-card'
import { TotalProductsCard } from '@/features/dashboard/ui/total-products-card'
import { LowStockProductsCard } from '@/features/dashboard/ui/low-stock-product-card'
import { CategoriesPieChart } from '@/features/dashboard/ui/categories-pie-chart-card'
import { MovementsChart } from '@/features/dashboard/ui/movements-chart-card'
import AppVersion from '@/components/version'

export default async function Home() {
  return (
    <>
      <section className="grid gap-4 p-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 overflow-auto">
        <TotalProductsCard />

        <LowStockProductsCard />

        <MostConsumedProductCard />

        <MovementsChart />

        <CategoriesPieChart />
      </section>
    </>
  )
}
