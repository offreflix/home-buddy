'use client'

import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import { MatchResults } from './components/match-results'
import { Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useScrapingModel } from '../scraping.model'
import { ProductMatch, ProductScrap } from '../scraping.type'

interface ScrapingDetailsProps {
  jobId: string
  onBack: () => void
}

export function ScrapingDetails({ jobId, onBack }: ScrapingDetailsProps) {
  const {
    handleAcceptMatch,
    handleRejectMatch,
    handleCreateProduct,
    handleSelectExistingProduct,
    acceptedMatches,
    rejectedMatches,
    setAcceptedMatches,
    setRejectedMatches,
    updateStockMutation,
    createProductMutation,
    productsQuery,
    categoriesQuery,
  } = useScrapingModel()

  const { data: operation, isLoading } = useQuery({
    queryKey: ['scraping-operation', jobId],
    queryFn: async () => {
      const response = await apiClient.get(`/tracking/operations/${jobId}`)
      return response.data
    },
  })

  useEffect(() => {
    if (operation?.matchingLog?.matcherResponse) {
      const response = operation.matchingLog.matcherResponse
      const accepted = new Set<string>()
      const rejected = new Set<string>()

      const processList = (
        list: (ProductMatch | ProductScrap)[] | undefined,
      ) => {
        if (!list) return
        list.forEach((item) => {
          const title = 'scrap_title' in item ? item.scrap_title : item.title
          const itemStatus = item as ProductMatch &
            ProductScrap & { status?: string }

          if (itemStatus.status === 'ACCEPTED') accepted.add(title)
          if (itemStatus.status === 'REJECTED') rejected.add(title)
        })
      }

      processList(response.match)
      processList(response.unmatch)

      setAcceptedMatches(accepted)
      setRejectedMatches(rejected)
    }
  }, [operation, setAcceptedMatches, setRejectedMatches])

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!operation) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Operação não encontrada.</p>
        <Button variant="outline" onClick={onBack} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>
    )
  }

  const matchingLog = operation.matchingLog
  const scrapingLog = operation.scrapingLog

  if (!matchingLog || !scrapingLog) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">
          Dados de scraping ou matching não disponíveis para esta operação.
        </p>
        <Button variant="outline" onClick={onBack} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>
    )
  }

  // Parse JSON data if it comes as string (Prisma sometimes returns JSON as object, sometimes string depending on config)
  const matchResult = matchingLog.matcherResponse
  const scrapedData = scrapingLog.outputData

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">
          Detalhes do Scraping
        </h2>
      </div>

      <MatchResults
        matchResult={matchResult}
        onAcceptMatch={(match: ProductMatch) =>
          handleAcceptMatch(match, scrapedData, jobId)
        }
        onRejectMatch={(match: ProductMatch) => handleRejectMatch(match, jobId)}
        onCreateProduct={(scrap: ProductScrap) =>
          handleCreateProduct(scrap, scrapedData, jobId)
        }
        onSelectExistingProduct={(scrap: ProductScrap, productId: string) =>
          handleSelectExistingProduct(scrap, productId, scrapedData, jobId)
        }
        acceptedMatches={acceptedMatches}
        rejectedMatches={rejectedMatches}
        isAcceptingProduct={updateStockMutation.isPending}
        isCreatingProduct={createProductMutation.isPending}
        scrapedData={scrapedData}
        availableProducts={productsQuery.data || []}
        availableCategories={categoriesQuery.data?.data || []}
      />
    </div>
  )
}
