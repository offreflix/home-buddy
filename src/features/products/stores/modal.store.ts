import { create } from 'zustand'
import type { Product } from '../model/types'

type ModalStore = {
  isOpen: boolean
  open: () => void
  close: () => void
  toggleModal: () => void

  isOpenEdit: boolean
  openEdit: () => void
  closeEdit: () => void
  toggleEditModal: () => void

  formValues: Product | null
  setEditProduct: (product: Product | null) => void
}

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggleModal: () => set((state) => ({ isOpen: !state.isOpen })),

  isOpenEdit: false,
  openEdit: () => set({ isOpenEdit: true }),
  closeEdit: () => set({ isOpenEdit: false }),
  toggleEditModal: () => set((state) => ({ isOpenEdit: !state.isOpenEdit })),

  formValues: null,
  setEditProduct: (product) => set({ formValues: product }),
}))
