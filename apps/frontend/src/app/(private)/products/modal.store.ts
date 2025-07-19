import { create } from 'zustand'
import { FormSchema } from './ui/update-product-dialog'

type ProductModalStore = {
  isAddModalOpen: boolean
  toggleAddModal: () => void

  isEditModalOpen: boolean
  toggleEditModal: () => void
  editingProduct: FormSchema | null
  setEditingProduct: (product: FormSchema) => void

  isDeleteModalOpen: boolean
  toggleDeleteModal: () => void

  isQuantityModalOpen: boolean
  toggleQuantityModal: () => void

  movementType: MovementType
  setMovementType: (type: MovementType) => void

  selectedProductId: number | null
  setSelectedProductId: (id: number) => void
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

  isQuantityModalOpen: false,
  toggleQuantityModal: () =>
    set((state) => ({ isQuantityModalOpen: !state.isQuantityModalOpen })),
  movementType: MovementType.IN,
  setMovementType: (type) => set({ movementType: type }),

  selectedProductId: null,
  setSelectedProductId: (id) => set({ selectedProductId: id }),
}))

export enum MovementType {
  IN = 'IN',
  OUT = 'OUT',
}
