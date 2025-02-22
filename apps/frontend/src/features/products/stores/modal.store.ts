import { create } from 'zustand'
import { FormSchema } from '../ui/update-product-dialog'

type ProductModalStore = {
  isAddModalOpen: boolean
  toggleAddModal: () => void

  isEditModalOpen: boolean
  toggleEditModal: () => void
  editingProduct: FormSchema | null
  setEditingProduct: (product: FormSchema) => void

  isDeleteModalOpen: boolean
  toggleDeleteModal: () => void
  deletingProductId: number | null
  setDeletingProductId: (id: number) => void

  isQuantityModalOpen: boolean
  toggleQuantityModal: () => void
  isIncreasingQuantity: boolean
  toggleIncreasingQuantity: () => void
}

export const useModalStore = create<ProductModalStore>((set) => ({
  isAddModalOpen: false,
  toggleAddModal: () =>
    set((state) => ({
      isAddModalOpen: !state.isAddModalOpen,
    })),

  isEditModalOpen: false,
  toggleEditModal: () =>
    set((state) => ({ isEditModalOpen: !state.isEditModalOpen })),
  editingProduct: null,
  setEditingProduct: (product) => set({ editingProduct: product }),

  isDeleteModalOpen: false,
  toggleDeleteModal: () =>
    set((state) => ({ isDeleteModalOpen: !state.isDeleteModalOpen })),
  deletingProductId: null,
  setDeletingProductId: (id) => set({ deletingProductId: id }),

  isQuantityModalOpen: false,
  toggleQuantityModal: () =>
    set((state) => ({ isQuantityModalOpen: !state.isQuantityModalOpen })),
  isIncreasingQuantity: true,
  toggleIncreasingQuantity: () =>
    set((state) => ({ isIncreasingQuantity: !state.isIncreasingQuantity })),
}))
