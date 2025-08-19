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

  console.log(jobStatus?.result?.data)
  console.log(jobStatus, hasMatchResult, jobStatus?.matchResult)

  return (
    <div className="w-full flex flex-col gap-6 justify-center items-center">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Scraping de NFC-e</h1>
          <p className="text-muted-foreground mt-1">
            Extraia dados de notas fiscais eletrônicas automaticamente
          </p>
        </div>
      </div>

      <div className="grid gap-6 w-6/12">
        {/* Formulário de Upload */}
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

        {/* Progresso do Job */}
        {currentJobId && jobStatus && (
          <JobProgress
            jobStatus={jobStatus}
            isPolling={isPolling}
            isCompleted={isCompleted}
            isFailed={isFailed}
          />
        )}

        {/* Result Summary */}
        {jobStatus && jobStatus.result?.data && (
          <ResultSummary data={jobStatus.result.data} />
        )}

        {/* Match Results */}
        {jobStatus && hasMatchResult && jobStatus.matchResult && (
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
            availableCategories={categoriesQuery.data || []}
          />
        )}

        {/* Resultado do Job (apenas se não houver match result) */}
        {jobStatus &&
          isCompleted &&
          jobStatus.result?.success &&
          jobStatus.result.data &&
          !hasMatchResult && (
            <ProductsList products={jobStatus.result.data.products} />
          )}

        {/* Histórico */}
        {jobStatus && <JobHistory jobStatus={jobStatus} />}
      </div>
    </div>
  )
}
