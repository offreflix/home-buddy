import { z } from 'zod'

const ConfigSchema = z.object({
  BACKEND_URL: z.string().default('http://localhost:3000'),
  MATCHER_URL: z.string().default('http://localhost:8000'),
  PAT_TOKEN: z.string().optional(), // Personal Access Token
  INTERNAL_TOKEN: z.string().default('algum_token_seguro'), // Mantido para compatibilidade
  OPENAI_API_KEY: z.string().optional(),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  DATABASE_URL: z.string().optional(),
  LOG_LEVEL: z.enum(['DEBUG', 'INFO', 'WARN', 'ERROR']).default('INFO'),
})

export class Config {
  private config: z.infer<typeof ConfigSchema>

  constructor() {
    this.config = ConfigSchema.parse({
      BACKEND_URL: process.env.BACKEND_URL,
      MATCHER_URL: process.env.MATCHER_URL,
      PAT_TOKEN: process.env.PAT_TOKEN,
      INTERNAL_TOKEN: process.env.INTERNAL_TOKEN,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      REDIS_URL: process.env.REDIS_URL,
      DATABASE_URL: process.env.DATABASE_URL,
      LOG_LEVEL: process.env.LOG_LEVEL,
    })
  }

  get backendUrl(): string {
    return this.config.BACKEND_URL
  }

  get matcherUrl(): string {
    return this.config.MATCHER_URL
  }

  get patToken(): string | undefined {
    return this.config.PAT_TOKEN
  }

  get internalToken(): string {
    return this.config.INTERNAL_TOKEN
  }

  get openaiApiKey(): string | undefined {
    return this.config.OPENAI_API_KEY
  }

  get redisUrl(): string {
    return this.config.REDIS_URL
  }

  get databaseUrl(): string | undefined {
    return this.config.DATABASE_URL
  }

  get logLevel(): string {
    return this.config.LOG_LEVEL
  }
}
