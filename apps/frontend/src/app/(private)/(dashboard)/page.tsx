'use server'

import React from 'react'
import { MostConsumedProductCard } from '@/app/(private)/(dashboard)/ui/most-consumed-product-card'
import { TotalProductsCard } from '@/app/(private)/(dashboard)/ui/total-products-card'
import { LowStockProductsCard } from '@/app/(private)/(dashboard)/ui/low-stock-product-card'
import { CategoriesPieChart } from '@/app/(private)/(dashboard)/ui/categories-pie-chart-card'
import { MovementsChart } from '@/app/(private)/(dashboard)/ui/movements-chart-card'
import AppVersion from '@/components/version'

export default async function DashboardPage() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do seu estoque e produtos
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <TotalProductsCard />
        <LowStockProductsCard />
        <MostConsumedProductCard />
        <MovementsChart />
        <CategoriesPieChart />
      </div>
    </section>
  )
}
