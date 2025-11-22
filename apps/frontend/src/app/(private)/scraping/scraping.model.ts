import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import {
  CreateScrapingJobSchema,
  ScrapingFormValues,
  ProductMatch,
  ProductScrap,
  ScrapedProduct,
  ScrapedData,
} from './scraping.type'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { createScrapingJobSchema } from './scraping.schema'
import { useAuth } from '@/context/auth/context'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/api-error'
import { CreateProductSchema, Unit } from '../products/products.type'

export const useScrapingModel = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)
  const [acceptedMatches, setAcceptedMatches] = useState<Set<string>>(new Set())
  const [rejectedMatches, setRejectedMatches] = useState<Set<string>>(new Set())

  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: () => apiClient.get('/products').then((res) => res.data),
  })

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () =>
      apiClient.get('/categories?perPage=0').then((res) => res.data),
  })

  const createJobMutation = useMutation({
    mutationFn: (data: CreateScrapingJobSchema) =>
      apiClient.post('/scrapping/queue', data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scraping-operations'] })
      toast.success('Job de scraping iniciado!')
    },
  })

  interface StockUpdateData {
    quantity: number
    type: 'IN' | 'OUT'
  }

  const updateStockMutation = useMutation({
    mutationFn: ({
      productId,
      stockData,
    }: {
      productId: string
      stockData: StockUpdateData
    }) =>
      apiClient
        .patch(`/products/update-stock/${productId}`, stockData)
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  const startNewJob = useCallback(() => {
    setError(null)
  }, [])

  const form = useForm<ScrapingFormValues>({
    resolver: zodResolver(createScrapingJobSchema),
    defaultValues: {
      url: '',
    },
  })

  const onSubmit = async (data: ScrapingFormValues) => {
    setError(null)

    try {
      await createJobMutation.mutateAsync({
        url: data.url.trim(),
        userId: user?.id ? parseInt(user.id) : undefined,
      })
      form.reset()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const handleAcceptMatch = useCallback(
    async (match: ProductMatch, scrapedData?: ScrapedData) => {
      try {
        setError(null)

        if (acceptedMatches.has(match.scrap_title)) {
          setError('Este produto já foi aceito')
          return
        }

        const scrapedProduct = scrapedData?.products?.find(
          (product: ScrapedProduct) => product.title === match.scrap_title,
        )

        if (!scrapedProduct) {
          setError('Produto não encontrado nos dados do scraping')
          return
        }

        const quantityToAdd = parseInt(scrapedProduct.quantity || '0') || 0

        if (quantityToAdd <= 0) {
          setError('Quantidade inválida no produto scrapado')
          return
        }

        const stockUpdateData = {
          quantity: quantityToAdd,
          type: 'IN' as const,
        }

        await updateStockMutation.mutateAsync({
          productId: match.product_id,
          stockData: stockUpdateData,
        })

        setAcceptedMatches((prev) => new Set([...prev, match.scrap_title]))

        toast.success('Produto aceito com sucesso!', {
          description: `Adicionado ${quantityToAdd} unidades ao estoque do produto ${match.product_id}`,
        })
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err)
        setError(errorMessage)

        toast.error('Erro ao aceitar produto', {
          description: errorMessage,
        })
      }
    },
    [setError, acceptedMatches, updateStockMutation],
  )

  const handleRejectMatch = useCallback(
    async (match: ProductMatch) => {
      try {
        setError(null)

        if (rejectedMatches.has(match.scrap_title)) {
          setError('Este produto já foi rejeitado')
          return
        }

        setRejectedMatches((prev) => new Set([...prev, match.scrap_title]))

        toast.info('Produto rejeitado', {
          description: `${match.scrap_title} foi movido para produtos não identificados`,
        })
      } catch (err: unknown) {
        console.error('Erro ao rejeitar match:', err)
      }
    },
    [rejectedMatches, setError],
  )

  const createProductMutation = useMutation({
    mutationFn: (productData: CreateProductSchema) =>
      apiClient.post('/products', productData).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  const mapUnitFromScraping = (scrapedUnit?: string): Unit => {
    if (!scrapedUnit) return Unit.unidade

    const unitMap: Record<string, Unit> = {
      kg: Unit.kg,
      g: Unit.g,
      l: Unit.L,
      ml: Unit.L,
      lata: Unit.lata,
      pacote: Unit.pacote,
      pct: Unit.pacote,
      un: Unit.unidade,
      und: Unit.unidade,
      unidade: Unit.unidade,
    }

    const normalizedUnit = scrapedUnit.toLowerCase().trim()
    return unitMap[normalizedUnit] || Unit.unidade
  }

  const handleCreateProduct = useCallback(
    async (scrap: ProductScrap, scrapedData?: ScrapedData) => {
      try {
        setError(null)

        const scrapedProduct = scrapedData?.products?.find(
          (product: ScrapedProduct) => product.title === scrap.title,
        )

        if (!scrapedProduct) {
          setError('Produto não encontrado nos dados do scraping')
          return
        }

        const unitValue = scrap.unit
          ? Object.values(Unit).includes(scrap.unit as Unit)
            ? (scrap.unit as Unit)
            : Unit.unidade
          : mapUnitFromScraping(scrapedProduct.unit)

        const productData: CreateProductSchema = {
          name: scrap.title,
          description: `Produto criado via scraping`,
          unit: unitValue,
          categoryId:
            scrap.categoryId || categoriesQuery.data?.data?.[0]?.id || 1,
          desiredQuantity: 1,
          currentQuantity: parseInt(scrapedProduct.quantity || '0') || 0,
        }

        await createProductMutation.mutateAsync(productData)

        setAcceptedMatches((prev) => new Set([...prev, scrap.title]))

        toast.success('Produto criado com sucesso!', {
          description: `${scrap.title} foi adicionado aos seus produtos`,
        })
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err)
        setError(errorMessage)

        toast.error('Erro ao criar produto', {
          description: errorMessage,
        })
      }
    },
    [setError, categoriesQuery.data, createProductMutation, setAcceptedMatches],
  )

  const handleSelectExistingProduct = useCallback(
    async (
      scrap: ProductScrap,
      selectedProductId: string,
      scrapedData?: ScrapedData,
    ) => {
      try {
        setError(null)

        const scrapedProduct = scrapedData?.products?.find(
          (product: ScrapedProduct) => product.title === scrap.title,
        )

        if (!scrapedProduct) {
          setError('Produto não encontrado nos dados do scraping')
          return
        }

        const quantityToAdd = parseInt(scrapedProduct.quantity || '0') || 0

        if (quantityToAdd <= 0) {
          setError('Quantidade inválida no produto scrapado')
          return
        }

        const stockUpdateData = {
          quantity: quantityToAdd,
          type: 'IN' as const,
        }

        await updateStockMutation.mutateAsync({
          productId: selectedProductId,
          stockData: stockUpdateData,
        })

        setAcceptedMatches((prev) => new Set([...prev, scrap.title]))

        toast.success('Produto vinculado com sucesso!', {
          description: `Adicionado ${quantityToAdd} unidades ao estoque do produto ${selectedProductId}`,
        })
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err)
        setError(errorMessage)

        toast.error('Erro ao vincular produto', {
          description: errorMessage,
        })
      }
    },
    [setError, updateStockMutation, setAcceptedMatches],
  )

  return {
    createJobMutation,
    updateStockMutation,
    createProductMutation,
    startNewJob,
    error,
    setError,
    form,
    onSubmit,
    acceptedMatches,
    rejectedMatches,
    productsQuery,
    categoriesQuery,
    handleAcceptMatch,
    handleRejectMatch,
    handleCreateProduct,
    handleSelectExistingProduct,
    // Legacy flags for compatibility if needed, though mostly unused now
    isCompleted: false,
    isFailed: false,
  }
}
