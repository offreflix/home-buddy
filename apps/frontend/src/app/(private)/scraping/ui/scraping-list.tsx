'use client'

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Loader2, Eye } from 'lucide-react'

interface ScrapingListProps {
  onSelectJob: (jobId: string) => void
}

export function ScrapingList({ onSelectJob }: ScrapingListProps) {
  const { data: operations, isLoading } = useQuery({
    queryKey: ['scraping-operations'],
    queryFn: async () => {
      const response = await apiClient.get('/tracking/operations', {
        params: {
          operationType: 'SCRAPING_MATCHING',
          limit: 20,
        },
      })
      return response.data
    },
  })

  // SSE updates will be handled by NotificationListener globally

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge className="bg-green-500">Concluído</Badge>
      case 'FAILED':
        return <Badge variant="destructive">Falhou</Badge>
      case 'RUNNING':
        return <Badge className="bg-blue-500">Processando</Badge>
      case 'PENDING':
        return <Badge variant="secondary">Na Fila</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Duração</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {operations?.map((op: any) => (
            <TableRow key={op.id}>
              <TableCell>
                {format(new Date(op.startTime), 'dd/MM/yyyy HH:mm', {
                  locale: ptBR,
                })}
              </TableCell>
              <TableCell
                className="max-w-[300px] truncate"
                title={op.metadata?.url}
              >
                {op.metadata?.url}
              </TableCell>
              <TableCell>{getStatusBadge(op.status)}</TableCell>
              <TableCell>
                {op.duration ? `${(op.duration / 1000).toFixed(1)}s` : '-'}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSelectJob(op.jobId)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Detalhes
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {operations?.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-8 text-muted-foreground"
              >
                Nenhum histórico de scraping encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
