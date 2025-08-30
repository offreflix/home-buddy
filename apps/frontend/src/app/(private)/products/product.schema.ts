import { z } from 'zod'
import { Unit } from './products.type'

export const createProductSchema = z.object({
  name: z.string().nonempty('Nome é obrigatório'),
  description: z.string().optional(),
  unit: z.nativeEnum(Unit),
  categoryId: z.number().int({ message: 'Categoria inválida' }),
  currentQuantity: z
    .number()
    .min(0, 'Quantidade atual deve ser maior ou igual a 0'),
  desiredQuantity: z
    .number()
    .positive('Quantidade desejada deve ser um número positivo')
    .min(1, 'Quantidade desejada deve ser maior ou igual a 1'),
})

export const quantitySchema = z.object({
  quantity: z.number().positive(),
})
