import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useJobPolling } from '@/hooks/use-job-polling'
import { JobProgress } from '@/components/job-progress'
import { Loader2, Upload } from 'lucide-react'
import { useAuth } from '@/context/auth/context'

export const ScrapingForm: React.FC = () => {
  const { user } = useAuth()
  const [url, setUrl] = useState('')
  const [jobId, setJobId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    status,
    isLoading,
    error: pollingError,
    isCompleted,
    isFailed,
    progress,
    message,
  } = useJobPolling(jobId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url.trim()) {
      setError('Por favor, insira uma URL válida')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/scrapping/queue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url.trim(),
          userId: user?.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao enviar job para a fila')
      }

      const result = await response.json()
      setJobId(result.jobId)

      setUrl('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNewJob = () => {
    setJobId(null)
    setError(null)
  }

  return (
    <div className="space-y-6">
      {/* Formulário de Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Extrair Dados de NFC-e
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">URL da NFC-e</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://www.sefaz.rs.gov.br/nfce/nfce-pesquisa.jsp"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isSubmitting || !!jobId}
                required
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || !!jobId || !url.trim()}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Extrair Dados
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Progresso do Job */}
      {jobId && (
        <div className="space-y-4">
          <JobProgress
            status={status}
            isLoading={isLoading}
            error={pollingError}
            isCompleted={isCompleted}
            isFailed={isFailed}
            progress={progress}
            message={message}
          />

          {/* Botão para novo job quando concluído */}
          {(isCompleted || isFailed) && (
            <Button onClick={handleNewJob} variant="outline" className="w-full">
              Processar Nova URL
            </Button>
          )}
        </div>
      )}

      {/* Resultado do Job */}
      {isCompleted && status?.result?.data && (
        <Card>
          <CardHeader>
            <CardTitle>Dados Extraídos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>Supermercado:</strong>{' '}
                {status.result.data.supermarketName}
              </p>
              <p>
                <strong>Total:</strong> {status.result.data.total}
              </p>
              <p>
                <strong>Data:</strong> {status.result.data.date}
              </p>
              <p>
                <strong>Produtos:</strong>{' '}
                {status.result.data.products?.length || 0}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
