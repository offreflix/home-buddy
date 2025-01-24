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
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { z } from 'zod'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PlusCircle } from 'lucide-react'
import { getProductsFromLocalStorageAPI } from './product-table'
import { useState } from 'react'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Unit, type Product } from './columns'

const addProductToLocalStorageAPI = async (product: Product): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const storedData = await getProductsFromLocalStorageAPI()
        localStorage.setItem(
          'products',
          JSON.stringify([...storedData, product])
        )
        resolve()
      } catch (error) {
        console.error('Error adding product to localStorage', error)
        reject(new Error('Failed to add product to localStorage'))
      }
    }, 1000)
  })
}

const formSchema = z.object({
  name: z.string().nonempty('Nome é obrigatório'),
  currentQuantity: z.coerce.number().int(),
  desiredQuantity: z.coerce
    .number()
    .int()
    .positive('Quantidade deve ser um número positivo'),
  unit: z.nativeEnum(Unit),
  category: z.string().nonempty('Categoria é obrigatória'),
})

export function CreateProductDialog() {
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      currentQuantity: 0,
      desiredQuantity: 0,
      unit: Unit.kg,
      category: '',
    },
  })

  const queryClient = useQueryClient()

  const mutation = useMutation<void, Error, Product>({
    mutationFn: addProductToLocalStorageAPI,
    onMutate: (product) => {
      queryClient.cancelQueries({ queryKey: ['products'] })
      const previousProducts = queryClient.getQueryData<Product[]>(['products'])
      queryClient.setQueryData<Product[]>(['products'], (old) => [
        ...(old ?? []),
        product,
      ])
      return { previousProducts }
    },
    onError: () => {
      toast.error('Falha ao adicionar produto')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onSuccess: () => {
      toast.success('Produto adicionado com sucesso')
      form.reset()
      setIsOpen(false)
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const productWithId = { ...values, id: crypto.randomUUID() }
    await mutation.mutateAsync(productWithId)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle />
          Adicionar Produto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Produto</DialogTitle>
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

            <div className="flex gap-4">
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
            </div>

            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidade</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a unidade" />
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
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
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
