'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Upload } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { UseFormReturn } from 'react-hook-form'
import { CreateScrapingJobSchema } from '../../scraping.type'

interface ScrapingFormProps {
  form: UseFormReturn<CreateScrapingJobSchema>
  onSubmit: (data: CreateScrapingJobSchema) => void
  error: string | null
  isPending: boolean
  isDisabled: boolean
  onStartNewJob: () => void
  isCompleted: boolean
  isFailed: boolean
}

export function ScrapingForm({
  form,
  onSubmit,
  error,
  isPending,
  isDisabled,
  onStartNewJob,
  isCompleted,
  isFailed,
}: ScrapingFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Extrair Dados de NFC-e
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Cole a URL da página de resultado da NFC-e do Espírito Santo
        </p>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da NFC-e</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="http://app.sefaz.es.gov.br/..."
                      disabled={isDisabled}
                      {...field}
                    />
                  </FormControl>
                  <div className="text-xs text-muted-foreground">
                    <p>URL deve ser do domínio http://app.sefaz.es.gov.br</p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <div className="rounded-md bg-red-50 p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2 w-full">
              <Button
                type="submit"
                disabled={isDisabled || !form.formState.isValid}
                className="col-span-2"
              >
                {isPending ? (
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
              {(isCompleted || isFailed) && (
                <Button
                  onClick={onStartNewJob}
                  variant="outline"
                  className="col-span-1"
                >
                  Processar Nova URL
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
