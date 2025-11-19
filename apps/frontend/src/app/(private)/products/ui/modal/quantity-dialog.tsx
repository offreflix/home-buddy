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

import { Minus, Plus } from 'lucide-react'
import { MovementType, useModalStore } from '../../modal.store'
import { cn } from '@/lib/utils'
import { useQuantityModel } from '../../quantity.model'

export function QuantityDialog() {
  const { isQuantityModalOpen, toggleQuantityModal, movementType } =
    useModalStore()
  const { form, handleQuantityChange, onSubmit, mutation } = useQuantityModel()

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
