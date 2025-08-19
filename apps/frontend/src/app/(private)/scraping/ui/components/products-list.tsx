'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrapedProduct } from '../../scraping.type'

interface ProductsListProps {
  products: ScrapedProduct[]
}

export function ProductsList({ products }: ProductsListProps) {
  return (
    <div className="space-y-4">
      {/* Products List */}
      <div className="space-y-4">
        <Separator />
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-primary rounded-full" />
          <h3 className="text-lg font-semibold">Produtos Extraídos</h3>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          {products.map((product: ScrapedProduct, index: number) => (
            <Card
              key={index}
              className="border bg-background/50 hover:bg-background/80 transition-colors duration-200"
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-sm leading-relaxed flex-1 mr-4">
                    {product.title}
                  </h4>
                  <Badge variant="secondary" className="font-semibold">
                    {product.totalPrice}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-muted/50 rounded-md p-2">
                    <span className="font-medium text-muted-foreground">
                      Código:
                    </span>
                    <span className="ml-2 font-mono">{product.code}</span>
                  </div>
                  <div className="bg-muted/50 rounded-md p-2">
                    <span className="font-medium text-muted-foreground">
                      Qtd:
                    </span>
                    <span className="ml-2">
                      {product.quantity} {product.unit}
                    </span>
                  </div>
                  <div className="bg-muted/50 rounded-md p-2">
                    <span className="font-medium text-muted-foreground">
                      Preço Unit:
                    </span>
                    <span className="ml-2 font-semibold">
                      {product.unitPrice}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
