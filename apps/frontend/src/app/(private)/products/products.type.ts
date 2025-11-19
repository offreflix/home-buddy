import { z } from 'zod'
import { createProductSchema, quantitySchema } from './product.schema'

export type CreateProductSchema = z.infer<typeof createProductSchema>

export type QuantitySchema = z.infer<typeof quantitySchema>

export type ViewMode = 'table' | 'grid'

export type Status = 'success' | 'error' | 422

export type StockStatus = 'critical' | 'low' | 'adequate' | 'high'

export interface ProductFilters {
  search: string
  categoryId: string
  stockStatus: string
  unit: string
}

export interface Product {
  id: number
  name: string
  description: string | null
  unit: string
  categoryId: number
  userId: number
  createdAt: string
  updatedAt: string
  category: {
    id: number
    name: string
    createdAt: string
    updatedAt: string
  }
  stock: {
    id: number
    productId: number
    currentQuantity: number
    desiredQuantity: number
    updatedAt: string
  } | null
  movements: Array<{
    id: number
    productId: number
    movementType: string
    quantity: number
    description: string | null
    createdAt: string
    stockId: number | null
    updatedAt: string
  }>
}

export interface PaginationMeta {
  page: number
  perPage: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  from: number
  to: number
}

export interface PaginationLinks {
  self: string
  next: string | null
  prev: string | null
  first: string
  last: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
  links: PaginationLinks
}

export interface PaginationParams {
  page?: number
  perPage?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
}

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

export interface Stock {
  id: number
  productId: number
  desiredQuantity: number
  currentQuantity: number
  updatedAt: string
}
