import { z } from 'zod'
import { createScrapingJobSchema } from './scraping.schema'

export type CreateScrapingJobSchema = z.infer<typeof createScrapingJobSchema>

export type JobStatus = 'waiting' | 'active' | 'completed' | 'failed'

export type JobPhase =
  | 'queued'
  | 'scraping'
  | 'matching'
  | 'finalizing'
  | 'completed'
  | 'failed'

export interface ScrapingJobResult {
  success: boolean
  data?: ScrapedData
  error?: string
}

export interface ScrapingJob {
  jobId: string
  state: JobStatus
  progress: number
  message: string
  phase: JobPhase
  result?: ScrapingJobResult
  matchResult?: MatchResult
  failedReason?: string
  data?: any
  timestamp?: number
  processedOn?: number
  finishedOn?: number
}

export interface ScrapedData {
  supermarketName: string
  total: string
  key: string
  date: string
  products: ScrapedProduct[]
}

export interface ScrapedProduct {
  title: string
  code: string
  quantity: string
  unit: string
  unitPrice: string
  totalPrice: string
}

export type Status = 'success' | 'error' | 422

export type CreateResult = {
  status: Status
  message: string
  jobId?: string
}

export type ScrapingMainProps = ReturnType<
  typeof import('./scraping.model').useScrapingModel
>

export type ScrapingFormValues = z.infer<typeof createScrapingJobSchema>

export interface ProductMatch {
  scrap_title: string
  product_id: string
  confidence: number
}

export interface ProductScrap {
  title: string
  code?: string
  quantity?: string
  unit?: string
  unitPrice?: string
  totalPrice?: string
  categoryId?: number
}

export interface MatchResult {
  match: ProductMatch[]
  unmatch: ProductScrap[]
}
