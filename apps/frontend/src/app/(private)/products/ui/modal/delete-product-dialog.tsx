'use client'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useModalStore } from '../../modal.store'

export function DeleteProductDialog() {
  const { selectedProductId, toggleDeleteModal, isDeleteModalOpen } =
    useModalStore()

  // const mutation = useMutation({
  //   mutationFn: (id: number) => productApi.deleteProduct(id),
  //   onMutate: () => {
  //     queryClient.invalidateQueries({ queryKey: ['products'] })
  //   },
  //   onError: () => {
  //     toast.error('Falha ao adicionar produto')
  //   },
  //   onSettled: () => {
  //     queryClient.invalidateQueries({ queryKey: ['products'] })
  //   },
  //   onSuccess: () => {
  //     toast.success('Produto adicionado com sucesso')
  //     toggleDeleteModal()
  //   },
  // })

  // function handleDelete(id: number) {
  //   mutation.mutateAsync(id)
  // }

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
          <Button
            onClick={() =>
              // selectedProductId !== null && handleDelete(selectedProductId)
              toast.info('Função temporariamente desabilitada')
            }
          >
            Continuar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
