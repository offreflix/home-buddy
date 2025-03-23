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
