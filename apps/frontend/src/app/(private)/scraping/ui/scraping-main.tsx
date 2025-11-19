'use client'

import { ScrapingMainProps } from '../scraping.type'
import { ScrapingForm } from './components/scraping-form'
import { JobProgress } from './components/job-progress'
import { ResultSummary } from './components/result-summary'
import { ProductsList } from './components/products-list'
import { JobHistory } from './components/job-history'
import { MatchResults } from './components/match-results'

export function ScrapingMain(props: ScrapingMainProps) {
  const {
    currentJobId,
    isPolling,
    jobStatus,
    isCompleted,
    isFailed,
    hasMatchResult,
    createJobMutation,
    updateStockMutation,
    createProductMutation,
    startNewJob,
    error,
    setError,
    form,
    onSubmit,
    acceptedMatches,
    rejectedMatches,
    productsQuery,
    categoriesQuery,
    handleAcceptMatch,
    handleRejectMatch,
    handleCreateProduct,
    handleSelectExistingProduct,
  } = props

  return (
    <div className="space-y-6">
      {/* Formulário de Scraping */}
      <div className="w-full max-w-2xl">
        <ScrapingForm
          form={form}
          onSubmit={onSubmit}
          error={error}
          isPending={createJobMutation.isPending}
          isDisabled={createJobMutation.isPending || !!currentJobId}
          onStartNewJob={startNewJob}
          isCompleted={isCompleted}
          isFailed={isFailed}
        />
      </div>

      {/* Progresso do Job */}
      {currentJobId && jobStatus && (
        <div className="w-full max-w-2xl">
          <JobProgress
            jobStatus={jobStatus}
            isPolling={isPolling}
            isCompleted={isCompleted}
            isFailed={isFailed}
          />
        </div>
      )}

      {/* Resultados */}
      {jobStatus && hasMatchResult && jobStatus.matchResult && (
        <div className="w-full max-w-4xl">
          <MatchResults
            matchResult={jobStatus.matchResult}
            onAcceptMatch={handleAcceptMatch}
            onRejectMatch={handleRejectMatch}
            onCreateProduct={handleCreateProduct}
            onSelectExistingProduct={handleSelectExistingProduct}
            acceptedMatches={acceptedMatches}
            rejectedMatches={rejectedMatches}
            isAcceptingProduct={updateStockMutation?.isPending}
            isCreatingProduct={createProductMutation?.isPending}
            scrapedData={jobStatus.result?.data}
            availableProducts={productsQuery.data || []}
            availableCategories={categoriesQuery.data?.data || []}
          />
        </div>
      )}

      {/* Histórico */}
      <div className="w-full max-w-4xl">
        <JobHistory />
      </div>
    </div>
  )
}
