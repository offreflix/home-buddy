'use client'

import { useScrapingModel } from './scraping.model'
import { ScrapingMain } from './ui/scraping-main'

export function ScrapingView() {
  const { ...methods } = useScrapingModel()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Scraping</h1>
        <p className="text-muted-foreground">
          Extraia e analise produtos de sites externos
        </p>
      </div>

      <ScrapingMain {...methods} />
    </div>
  )
}
