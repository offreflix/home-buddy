import { z } from 'zod'
import { createProductSchema, quantitySchema } from './product.schema'

export type CreateProductSchema = z.infer<typeof createProductSchema>

export type QuantitySchema = z.infer<typeof quantitySchema>

export type ViewMode = 'card' | 'table'

export type Status = 'success' | 'error' | 422

export type CreateResult = {
  status: Status
  message: string
}

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
