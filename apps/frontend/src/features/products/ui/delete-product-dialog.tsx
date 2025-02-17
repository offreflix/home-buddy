'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useModalStore } from '../stores/modal.store'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { productApi } from '../api/product-api'
import { queryClient } from '@/lib/react-query'

export function DeleteProductDialog() {
  const { deletingProductId, toggleDeleteModal, isDeleteModalOpen } =
    useModalStore()

  const mutation = useMutation({
    mutationFn: (id: string) => productApi.deleteProduct(id),
    onMutate: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: () => {
      toast.error('Falha ao adicionar produto')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onSuccess: () => {
      toast.success('Produto adicionado com sucesso')
      toggleDeleteModal()
    },
  })

  function handleDelete(id: string) {
    mutation.mutateAsync(id)
  }

  return (
    <AlertDialog open={isDeleteModalOpen} onOpenChange={toggleDeleteModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Você está prestes a excluir um produto. Esta ação não pode ser
            desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button onClick={() => handleDelete(deletingProductId)}>
            Continuar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
