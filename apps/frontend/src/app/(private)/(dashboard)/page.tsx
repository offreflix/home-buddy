'use server'

import React from 'react'
import { MostConsumedProductCard } from '@/app/(private)/(dashboard)/ui/most-consumed-product-card'
import { TotalProductsCard } from '@/app/(private)/(dashboard)/ui/total-products-card'
import { LowStockProductsCard } from '@/app/(private)/(dashboard)/ui/low-stock-product-card'
import { CategoriesPieChart } from '@/app/(private)/(dashboard)/ui/categories-pie-chart-card'
import { MovementsChart } from '@/app/(private)/(dashboard)/ui/movements-chart-card'
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
