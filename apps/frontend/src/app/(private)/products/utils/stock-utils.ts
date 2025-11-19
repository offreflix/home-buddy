import { StockStatus, Product } from '../products.type'

export function getStockStatus(
  currentQuantity: number,
  desiredQuantity: number,
): StockStatus {
  const percentage = (currentQuantity / desiredQuantity) * 100

  if (percentage <= 10) return 'critical'
  if (percentage <= 30) return 'low'
  if (percentage <= 90) return 'adequate'
  return 'high'
}

export function getStockStatusColor(status: StockStatus): string {
  switch (status) {
    case 'critical':
      return 'destructive'
    case 'low':
      return 'secondary'
    case 'adequate':
      return 'default'
    case 'high':
      return 'default'
    default:
      return 'default'
  }
}

export function getStockStatusLabel(status: StockStatus): string {
  switch (status) {
    case 'critical':
      return 'Crítico'
    case 'low':
      return 'Baixo'
    case 'adequate':
      return 'Adequado'
    case 'high':
      return 'Alto'
    default:
      return 'Adequado'
  }
}

export function shouldShowAlert(product: Product): boolean {
  if (!product.stock) return false
  const status = getStockStatus(
    product.stock.currentQuantity,
    product.stock.desiredQuantity,
  )
  return status === 'critical' || status === 'low'
}

export function getStockPercentage(
  currentQuantity: number,
  desiredQuantity: number,
): number {
  return Math.min((currentQuantity / desiredQuantity) * 100, 100)
}

export function filterProductsByStock(
  products: Product[],
  stockStatus: string,
): Product[] {
  if (!stockStatus || stockStatus === 'all') return products

  return products.filter((product) => {
    if (!product.stock) return false
    const status = getStockStatus(
      product.stock.currentQuantity,
      product.stock.desiredQuantity,
    )
    return status === stockStatus
  })
}
