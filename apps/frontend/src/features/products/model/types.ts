export enum Unit {
  kg = 'kg',
  g = 'g',
  L = 'L',
  lata = 'lata',
  pacote = 'pacote',
  unidade = 'unidade',
}

export interface Category {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: number
  name: string
  description: string
  unit: string
  createdAt: string
  updatedAt: string
  categoryId: number
  userId: number
  category: Category
  stock: Stock
}

export interface Stock {
  id: number
  productId: number
  desiredQuantity: number
  currentQuantity: number
  updatedAt: string
}
