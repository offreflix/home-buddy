import { z } from 'zod'
import { Unit } from '../model/types'

export const createProductSchema = z.object({
  name: z.string().nonempty('Nome é obrigatório'),
  description: z.string().optional(),
  unit: z.nativeEnum(Unit),
  categoryId: z.coerce.number().int({ message: 'Categoria inválida' }),
  currentQuantity: z.coerce
    .number()
    .min(0, 'Quantidade atual deve ser maior ou igual a 0'),
  desiredQuantity: z.coerce
    .number()
    .positive('Quantidade desejada deve ser um número positivo'),
})

export const quantitySchema = z.object({
  quantity: z.number().positive(),
})
