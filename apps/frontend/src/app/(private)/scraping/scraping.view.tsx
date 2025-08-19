'use client'

import { useScrapingModel } from './scraping.model'
import { ScrapingMain } from './ui/scraping-main'

export function ScrapingView() {
  const { ...methods } = useScrapingModel()

  return (
    <div className="p-8 flex flex-col gap-4 overflow-y-auto">
      <ScrapingMain {...methods} />
    </div>
  )
}
