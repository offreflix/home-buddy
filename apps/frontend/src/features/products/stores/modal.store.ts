import { create } from 'zustand'
import type { Product } from '../model/types'
import { FormSchema } from '../ui/update-product-dialog'

type ProductModalStore = {
  isAddModalOpen: boolean
  toggleAddModal: () => void

  isEditModalOpen: boolean
  editingProduct: FormSchema | null
  toggleEditModal: () => void
  setEditingProduct: (product: FormSchema) => void

  isDeleteModalOpen: boolean
  deletingProductId: number | null
  toggleDeleteModal: () => void
  setDeletingProductId: (id: number) => void
}

export const useModalStore = create<ProductModalStore>((set) => ({
  isAddModalOpen: false,
  toggleAddModal: () =>
    set((state) => ({
      isAddModalOpen: !state.isAddModalOpen,
    })),

  isEditModalOpen: false,
  editingProduct: null,
  toggleEditModal: () =>
    set((state) => ({ isEditModalOpen: !state.isEditModalOpen })),
  setEditingProduct: (product) => set({ editingProduct: product }),

  isDeleteModalOpen: false,
  deletingProductId: null,
  toggleDeleteModal: () =>
    set((state) => ({ isDeleteModalOpen: !state.isDeleteModalOpen })),
  setDeletingProductId: (id) => set({ deletingProductId: id }),
}))
