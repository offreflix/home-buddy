import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { apiClient } from '@/api/client'
import { useModalStore } from '../../modal.store'
import { CreateProductSchema } from '../../products.type'
import { CREATE_PRODUCTS_MESSAGES } from '../products.messages'
import { createProductSchema } from '../../product.schema'

export const useCreateProductModel = () => {
  const { toggleAddModal } = useModalStore()

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiClient.get('categories').then((res) => res.data),
  })

  const defaultValues = {
    name: '',
    description: '',
    currentQuantity: 0,
    desiredQuantity: 0,
    unit: undefined,
    categoryId: undefined,
  }

  const form = useForm<CreateProductSchema>({
    resolver: zodResolver(createProductSchema),
    defaultValues,
  })

  const queryClient = useQueryClient()

  const mutation = useMutation<void, AxiosError, CreateProductSchema>({
    mutationFn: (product: CreateProductSchema) => {
      return apiClient.post('products', product)
    },
    onMutate: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error: AxiosError) => {
      switch (error.response?.status) {
        case 422:
          toast.error(CREATE_PRODUCTS_MESSAGES[422].message)
          break
        default:
          toast.error(CREATE_PRODUCTS_MESSAGES.error.message)
          break
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onSuccess: () => {
      toast.success(CREATE_PRODUCTS_MESSAGES.success.message)
      form.reset()
      toggleAddModal()
    },
  })

  async function onSubmit(values: CreateProductSchema) {
    await mutation.mutateAsync(values)
  }

  return {
    form,
    onSubmit,
    categoriesQuery,
    mutation,
  }
}
