'use client'

import { Building2, Calendar, DollarSign, Package } from 'lucide-react'
import { ScrapedData } from '../../scraping.type'

interface ResultSummaryProps {
  data: ScrapedData
}

export function ResultSummary({ data }: ResultSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.supermarketName && (
        <div className="bg-muted/30 rounded-lg p-4 space-y-2 col-span-1">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Supermercado
            </span>
          </div>
          <p className="font-semibold truncate">{data.supermarketName}</p>
        </div>
      )}

      {data.total && (
        <div className="bg-muted/30 rounded-lg p-4 space-y-2 col-span-1">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Total
            </span>
          </div>
          <p className="font-semibold text-lg">{data.total}</p>
        </div>
      )}

      {data.date && (
        <div className="bg-muted/30 rounded-lg p-4 space-y-2 col-span-1">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Data
            </span>
          </div>
          <p className="font-semibold">{data.date}</p>
        </div>
      )}

      {data.products.length && (
        <div className="bg-muted/30 rounded-lg p-4 space-y-2 col-span-1">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Produtos
            </span>
          </div>
          <p className="font-semibold text-lg">{data.products.length}</p>
        </div>
      )}
    </div>
  )
}
