import { create } from 'zustand'
import type { Product } from '../model/types'

type ProductModalStore = {
  isAddModalOpen: boolean
  toggleAddModal: () => void

  isEditModalOpen: boolean
  editingProduct: Product | null
  toggleEditModal: () => void
  setEditingProduct: (product: Product) => void

  isDeleteModalOpen: boolean
  deletingProductId: string
  toggleDeleteModal: () => void
  setDeletingProductId: (id: string) => void
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
  deletingProductId: '',
  toggleDeleteModal: () =>
    set((state) => ({ isDeleteModalOpen: !state.isDeleteModalOpen })),
  setDeletingProductId: (id) => set({ deletingProductId: id }),
}))
