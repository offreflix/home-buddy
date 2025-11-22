'use client'

import { useState, useEffect } from 'react'
import { useScrapingModel } from './scraping.model'
import { ScrapingList } from './ui/scraping-list'
import { ScrapingDetails } from './ui/scraping-details'
import { ScrapingForm } from './ui/components/scraping-form'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useSearchParams, useRouter } from 'next/navigation'

export function ScrapingView() {
  const {
    form,
    onSubmit,
    error,
    createJobMutation,
    startNewJob,
    isCompleted,
    isFailed,
  } = useScrapingModel()

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  // Handle query param for deep linking
  useEffect(() => {
    const jobId = searchParams.get('jobId')
    if (jobId) {
      setSelectedJobId(jobId)
    }
  }, [searchParams])

  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId)
    router.push(`/scraping?jobId=${jobId}`)
  }

  const handleBack = () => {
    setSelectedJobId(null)
    router.push('/scraping')
  }

  const handleCreateSuccess = () => {
    setIsDialogOpen(false)
    // Optional: toast is already handled in model or we can add here
  }

  // Wrap onSubmit to close dialog on success
  const handleFormSubmit = async (data: any) => {
    await onSubmit(data)
    if (!error) {
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      {!selectedJobId && (
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Scraping</h1>
            <p className="text-muted-foreground">
              Histórico de extrações e análises de produtos
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={startNewJob}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Extração
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Nova Extração de NFC-e</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <ScrapingForm
                  form={form}
                  onSubmit={handleFormSubmit}
                  error={error}
                  isPending={createJobMutation.isPending}
                  isDisabled={createJobMutation.isPending}
                  onStartNewJob={startNewJob}
                  isCompleted={isCompleted}
                  isFailed={isFailed}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {selectedJobId ? (
        <ScrapingDetails jobId={selectedJobId} onBack={handleBack} />
      ) : (
        <ScrapingList onSelectJob={handleJobSelect} />
      )}
    </div>
  )
}
