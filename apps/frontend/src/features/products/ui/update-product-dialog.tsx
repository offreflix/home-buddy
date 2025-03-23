'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'

import { z } from 'zod'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Category, Unit } from '../model/types'
import { useModalStore } from '../stores/modal.store'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { AxiosError } from 'axios'
import { apiClient } from '@/api/client'

function handleProductEditError(error: Error) {
  if (error instanceof AxiosError) {
    switch (error.status) {
      case 400:
      case 404:
        toast.error('Produto não encontrado')
        break
      case 401:
      case 403:
        toast.error('Você não tem permissão para editar este produto')
        break
      case 409:
        toast.error('Já existe um produto com este nome')
        break
      default:
        toast.error('Falha ao editar produto')
        break
    }
  }
}

const formSchema = z.object({
  id: z.coerce.number().int({ message: 'ID inválido' }),
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

export type FormSchema = z.infer<typeof formSchema>

export function UpdateProductDialog() {
  const { isEditModalOpen, toggleEditModal, editingProduct } = useModalStore()

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiClient.get('categories').then((res) => res.data),
  })

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: editingProduct ?? {
      name: '',
      currentQuantity: 0,
      desiredQuantity: 0,
      unit: Unit.kg,
      categoryId: 0,
    },
  })

  const queryClient = useQueryClient()

  const mutation = useMutation<void, Error, FormSchema>({
    mutationFn: (product: FormSchema) =>
      apiClient.patch(`products/id/${product.id}`, product),
    onMutate: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (e) => {
      handleProductEditError(e)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onSuccess: () => {
      toast.success('Produto adicionado com sucesso')
      form.reset()
      toggleEditModal()
    },
  })

  async function onSubmit(values: FormSchema) {
    await mutation.mutateAsync(values)
  }

  useEffect(() => {
    if (editingProduct) {
      form.reset(editingProduct)
    }
  }, [editingProduct, form])

  return (
    <Dialog open={isEditModalOpen} onOpenChange={toggleEditModal}>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
          <DialogDescription>
            Adicione um novo produto ao seu estoque.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Esse é o nome que será exibido em seus produto.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>A descrição do produto.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <div className="flex gap-4">
              <FormField
                control={form.control}
                name="currentQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade Atual</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      A quantidade atual do produto em estoque.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="desiredQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade Desejada</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      A quantidade desejada do produto em estoque.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div> */}

            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidade</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(Unit).map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    A unidade de medida do produto.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoriesQuery?.data?.map((category: Category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>A categoria do produto.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button disabled={mutation.isPending} type="submit">
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
