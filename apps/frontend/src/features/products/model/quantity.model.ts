import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MovementType, useModalStore } from '../stores/modal.store'
import { AxiosError } from 'axios'
import { useEffect } from 'react'
import { apiClient } from '@/api/client'
import { QuantitySchema } from './products.type'
import { quantitySchema } from './product.schema'

export const useQuantityModel = () => {
  const {
    isQuantityModalOpen,
    toggleQuantityModal,
    movementType,
    selectedProductId,
  } = useModalStore()

  const form = useForm<QuantitySchema>({
    resolver: zodResolver(quantitySchema),
    defaultValues: {
      quantity: 0,
    },
  })

  const queryClient = useQueryClient()

  const mutation = useMutation<void, AxiosError, QuantitySchema>({
    mutationFn: (movement: QuantitySchema) => {
      return apiClient.patch(`products/update-stock/${selectedProductId}`, {
        quantity: movement.quantity,
        type: movementType,
      })
    },
    onMutate: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error: AxiosError) => {
      switch (error.response?.status) {
        case 422:
          toast.error('Já existe um produto com o mesmo nome.')
          break
        default:
          toast.error('Falha ao adicionar produto, tente novamente mais tarde')
          break
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onSuccess: () => {
      toast.success(
        movementType === MovementType.IN
          ? 'Produto adicionado com sucesso'
          : 'Produto removido com sucesso',
      )
      form.reset()
      toggleQuantityModal()
    },
  })

  useEffect(() => {
    if (isQuantityModalOpen) {
      form.reset({ quantity: 0 })
    }
  }, [isQuantityModalOpen, form])

  async function onSubmit(values: QuantitySchema) {
    await mutation.mutateAsync(values)
  }

  const handleQuantityChange = (change: number) => {
    const currentValue = form.getValues('quantity')
    const newValue = Math.max(1, currentValue + change)
    form.setValue('quantity', newValue, { shouldValidate: true })
  }

  return {
    form,
    handleQuantityChange,
    onSubmit,
    mutation,
  }
}
