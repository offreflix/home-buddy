'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { z } from 'zod'

import { Minus, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MovementType, useModalStore } from '../stores/modal.store'
import { apiClient } from './product-main'
import { AxiosError } from 'axios'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'

export const formSchema = z.object({
  quantity: z.number().positive(),
})

type FormSchema = z.infer<typeof formSchema>

export function QuantityDialog() {
  const {
    isQuantityModalOpen,
    toggleQuantityModal,
    movementType,
    selectedProductId,
  } = useModalStore()

  console.log(movementType)

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 0,
    },
  })

  console.log(form.formState.errors)

  const queryClient = useQueryClient()

  const mutation = useMutation<void, AxiosError, FormSchema>({
    mutationFn: (movement: FormSchema) => {
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
      toast.success('Produto adicionado com sucesso')
      form.reset()
      toggleQuantityModal()
    },
  })

  useEffect(() => {
    if (isQuantityModalOpen) {
      form.reset({ quantity: 0 })
    }
  }, [isQuantityModalOpen, form])

  async function onSubmit(values: FormSchema) {
    console.log({
      quantity: values.quantity,
      type: movementType,
    })
    await mutation.mutateAsync(values)
  }

  const handleQuantityChange = (change: number) => {
    const currentValue = form.getValues('quantity')
    const newValue = Math.max(1, currentValue + change)
    form.setValue('quantity', newValue, { shouldValidate: true })
  }

  return (
    <Dialog open={isQuantityModalOpen} onOpenChange={toggleQuantityModal}>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            {movementType === MovementType.IN ? 'Adicionar' : 'Remover'}{' '}
            Quantidade
          </DialogTitle>
          <DialogDescription>
            {movementType === MovementType.IN ? 'Adicione' : 'Remova'} a
            quantidade de um produto.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div
                      className={cn(
                        'flex justify-center items-center space-x-2',
                      )}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={field.value <= 1}
                        className="transition-transform duration-200 hover:scale-105"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        {...field}
                        type="number"
                        onChange={(e) =>
                          field.onChange(
                            Number.parseInt(e.target.value, 10) || 1,
                          )
                        }
                        className={cn(
                          'w-20 text-center',
                          'transition-all duration-200',
                          'focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600',
                          'hover:border-neutral-300 dark:hover:border-neutral-600',
                        )}
                        min={1}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(1)}
                        className="transition-transform duration-200 hover:scale-105"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button disabled={mutation.isPending} type="submit">
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
