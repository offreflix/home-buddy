'use client'

import { ScrapingJob } from '../../scraping.type'

interface JobHistoryProps {
  jobStatus?: ScrapingJob
}

export function JobHistory({ jobStatus }: JobHistoryProps) {
  return (
    <div className="bg-muted/30 rounded-lg p-4 space-y-3">
      <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
        Histórico de Jobs
      </h4>
      <div className="space-y-2 text-sm">
        {jobStatus?.timestamp && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Criado:</span>
            <span className="font-mono text-xs">
              {new Date(jobStatus.timestamp).toLocaleString()}
            </span>
          </div>
        )}
        {jobStatus?.processedOn && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Iniciado:</span>
            <span className="font-mono text-xs">
              {new Date(jobStatus.processedOn).toLocaleString()}
            </span>
          </div>
        )}
        {jobStatus?.finishedOn && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Finalizado:</span>
            <span className="font-mono text-xs">
              {new Date(jobStatus.finishedOn).toLocaleString()}
            </span>
          </div>
        )}
        {!jobStatus && (
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm">
              Nenhum job executado ainda
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
