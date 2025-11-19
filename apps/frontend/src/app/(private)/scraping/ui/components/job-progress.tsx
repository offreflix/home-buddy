'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, AlertCircle } from 'lucide-react'
import {
  getStatusIcon,
  getStatusColor,
  getPhaseLabel,
  getPhaseColor,
} from '../../status.utils'
import { ScrapingJob } from '../../scraping.type'

interface JobProgressProps {
  jobStatus: ScrapingJob
  isPolling: boolean
  isCompleted: boolean
  isFailed: boolean
}

export function JobProgress({
  jobStatus,
  isPolling,
  isCompleted,
  isFailed,
}: JobProgressProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          {getStatusIcon(jobStatus.state, isPolling)}
          Job #{jobStatus.jobId}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <Badge className={getPhaseColor(jobStatus.phase)}>
            {getPhaseLabel(jobStatus.phase)}
          </Badge>

          <span className="text-sm text-gray-500">{jobStatus.progress}%</span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={jobStatus.progress} className="h-2" />
          <p className="text-sm text-gray-600">{jobStatus.message}</p>
        </div>

        {/* Result Summary */}
        {isCompleted && jobStatus.result?.success && jobStatus.result.data && (
          <Alert className="border-green-200 bg-green-50 dark:border-green-950 dark:bg-green-950/20 animate-in slide-in-from-top-2">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              <div className="font-medium">Processamento concluído!</div>
              <div className="text-sm mt-1">
                {jobStatus.result.data.products.length} produtos extraídos com
                sucesso
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Failed Summary */}
        {isFailed && (
          <Alert className="border-red-200 bg-red-50 dark:border-red-950 dark:bg-red-950/20 animate-in slide-in-from-top-2">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              <div className="font-medium">Processamento falhou</div>
              <div className="text-sm mt-1">
                {jobStatus.failedReason && (
                  <p className="text-xs text-red-700 mt-1">
                    {jobStatus.failedReason}
                  </p>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
