import { create } from 'zustand'
import { ScrapingJob } from './scraping.type'

type ScrapingModalStore = {
  isJobDetailsModalOpen: boolean
  toggleJobDetailsModal: () => void
  selectedJob: ScrapingJob | null
  setSelectedJob: (job: ScrapingJob) => void

  isJobHistoryModalOpen: boolean
  toggleJobHistoryModal: () => void

  isSettingsModalOpen: boolean
  toggleSettingsModal: () => void
}

export const useScrapingModalStore = create<ScrapingModalStore>((set) => ({
  isJobDetailsModalOpen: false,
  toggleJobDetailsModal: () =>
    set((state) => ({
      isJobDetailsModalOpen: !state.isJobDetailsModalOpen,
    })),
  selectedJob: null,
  setSelectedJob: (job) => set({ selectedJob: job }),

  isJobHistoryModalOpen: false,
  toggleJobHistoryModal: () =>
    set((state) => ({
      isJobHistoryModalOpen: !state.isJobHistoryModalOpen,
    })),

  isSettingsModalOpen: false,
  toggleSettingsModal: () =>
    set((state) => ({
      isSettingsModalOpen: !state.isSettingsModalOpen,
    })),
}))
