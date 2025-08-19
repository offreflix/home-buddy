import { z } from 'zod'

export const createScrapingJobSchema = z.object({
  url: z
    .string()
    .min(1, 'Por favor, insira uma URL válida')
    .refine(
      (url) => url.startsWith('http://app.sefaz.es.gov.br'),
      'Apenas URLs do domínio http://app.sefaz.es.gov.br são permitidas',
    ),
  userId: z.number().optional(),
})

export const scrapedProductSchema = z.object({
  title: z.string(),
  code: z.string(),
  quantity: z.string(),
  unit: z.string(),
  unitPrice: z.string(),
  totalPrice: z.string(),
})

export const scrapedDataSchema = z.object({
  supermarketName: z.string(),
  total: z.string(),
  key: z.string(),
  date: z.string(),
  products: z.array(scrapedProductSchema),
})

export const scrapingJobResultSchema = z.object({
  success: z.boolean(),
  data: scrapedDataSchema.optional(),
  error: z.string().optional(),
})

export const jobStatusSchema = z.object({
  jobId: z.string(),
  state: z.enum(['waiting', 'active', 'completed', 'failed']),
  progress: z.number().min(0).max(100),
  message: z.string(),
  phase: z.enum([
    'queued',
    'scraping',
    'matching',
    'finalizing',
    'completed',
    'failed',
  ]),
  result: scrapingJobResultSchema.optional(),
  failedReason: z.string().optional(),
  data: z.any().optional(),
  timestamp: z.number().optional(),
  processedOn: z.number().optional(),
  finishedOn: z.number().optional(),
})
