export interface Count {
  count: number
}

export interface MostConsumed {
  product: string
  quantity: number
  unit: string
  percentageChange: number
}

export interface CountByCategory {
  name: string
  count: number
}

export interface Movements {
  date: string
  IN: number
  OUT: number
}
