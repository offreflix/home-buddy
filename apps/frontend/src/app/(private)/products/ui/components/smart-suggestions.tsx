'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  Package,
  Tag,
  BarChart3,
  AlertTriangle,
  Plus,
  X,
} from 'lucide-react'
import { Product } from '../../products.type'
import { getStockStatus, shouldShowAlert } from '../../utils/stock-utils'
import { useState } from 'react'

interface SmartSuggestionsProps {
  products: Product[]
  onApplySuggestion?: (suggestion: Suggestion) => void
  onQuickRestock?: (productId: number, suggestedQuantity: number) => void
}

interface Suggestion {
  id: string
  type:
    | 'critical_alert'
    | 'low_alert'
    | 'reorder_point'
    | 'overstock'
    | 'category_optimization'
    | 'usage_pattern'
  title: string
  description: string
  priority: 'urgent' | 'high' | 'medium' | 'low'
  productIds: number[]
  action: string
  impact: string
}

export function SmartSuggestions({
  products,
  onApplySuggestion,
  onQuickRestock,
}: SmartSuggestionsProps) {
  const [expandedInsights, setExpandedInsights] = useState<Set<string>>(
    new Set(),
  )
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<number>>(new Set())

  const handleDismissAlert = (productId: number) => {
    setDismissedAlerts((prev) => new Set([...prev, productId]))
  }

  const getSuggestedRestockQuantity = (product: Product): number => {
    const deficit =
      product.stock.desiredQuantity - product.stock.currentQuantity
    return Math.max(deficit, 1)
  }

  const generateInsights = (): Suggestion[] => {
    const insights: Suggestion[] = []

    const criticalProducts = products.filter((product) => {
      if (dismissedAlerts.has(product.id)) return false
      return (
        shouldShowAlert(product) &&
        getStockStatus(
          product.stock.currentQuantity,
          product.stock.desiredQuantity,
        ) === 'critical'
      )
    })

    if (criticalProducts.length > 0) {
      insights.push({
        id: 'critical-alert',
        type: 'critical_alert',
        title:
          criticalProducts.length === 1
            ? 'Produto acabando'
            : `${criticalProducts.length} produtos acabando`,
        description:
          criticalProducts.length === 1
            ? `${criticalProducts[0].name} está quase acabando`
            : `${criticalProducts[0].name} e mais ${criticalProducts.length - 1} estão quase acabando`,
        priority: 'urgent',
        productIds: criticalProducts.map((p) => p.id),
        action: 'Repor o quanto antes',
        impact: 'Evita ficar sem produtos essenciais',
      })
    }

    const lowProducts = products.filter((product) => {
      if (dismissedAlerts.has(product.id)) return false
      return (
        shouldShowAlert(product) &&
        getStockStatus(
          product.stock.currentQuantity,
          product.stock.desiredQuantity,
        ) === 'low'
      )
    })

    if (lowProducts.length > 0) {
      insights.push({
        id: 'low-alert',
        type: 'low_alert',
        title:
          lowProducts.length === 1
            ? 'Produto em baixa'
            : `${lowProducts.length} produtos em baixa`,
        description:
          lowProducts.length === 1
            ? `${lowProducts[0].name} está com estoque baixo`
            : `${lowProducts[0].name} e mais ${lowProducts.length - 1} estão com estoque baixo`,
        priority: 'high',
        productIds: lowProducts.map((p) => p.id),
        action: 'Considere repor em breve',
        impact: 'Mantém o estoque sempre disponível',
      })
    }

    const fastConsumingProducts = products.filter((product) => {
      const percentage =
        (product.stock.currentQuantity / product.stock.desiredQuantity) * 100
      return percentage < 50 && product.stock.desiredQuantity > 5
    })

    if (fastConsumingProducts.length > 0) {
      insights.push({
        id: 'fast-consuming',
        type: 'reorder_point',
        title: 'Produtos que acabam rápido',
        description: `${fastConsumingProducts.length} produtos costumam acabar antes dos outros`,
        priority: 'high',
        productIds: fastConsumingProducts.map((p) => p.id),
        action: 'Considere comprar em maior quantidade',
        impact: 'Evita ir ao mercado com frequência',
      })
    }

    const overstockedProducts = products.filter((product) => {
      const percentage =
        (product.stock.currentQuantity / product.stock.desiredQuantity) * 100
      return percentage > 150
    })

    if (overstockedProducts.length > 0) {
      insights.push({
        id: 'overstocked',
        type: 'overstock',
        title: 'Produtos em excesso',
        description: `${overstockedProducts.length} produtos têm mais do que o necessário`,
        priority: 'medium',
        productIds: overstockedProducts.map((p) => p.id),
        action: 'Pode reduzir a quantidade na próxima compra',
        impact: 'Economiza espaço no armário',
      })
    }

    const categoryStats = products.reduce(
      (acc, product) => {
        const categoryName = product.category.name
        if (!acc[categoryName]) {
          acc[categoryName] = { total: 0, critical: 0, products: [] }
        }
        acc[categoryName].total++
        acc[categoryName].products.push(product)

        const status = getStockStatus(
          product.stock.currentQuantity,
          product.stock.desiredQuantity,
        )
        if (status === 'critical' || status === 'low') {
          acc[categoryName].critical++
        }

        return acc
      },
      {} as Record<
        string,
        { total: number; critical: number; products: Product[] }
      >,
    )

    const problematicCategories = Object.entries(categoryStats).filter(
      ([_, stats]) => stats.critical / stats.total > 0.4 && stats.total >= 3,
    )

    if (problematicCategories.length > 0) {
      const [categoryName, stats] = problematicCategories[0]
      insights.push({
        id: 'problematic-category',
        type: 'category_optimization',
        title: `Categoria "${categoryName}" precisa de atenção`,
        description: `${stats.critical} de ${stats.total} produtos desta categoria estão em falta`,
        priority: 'high',
        productIds: stats.products.map((p) => p.id),
        action: 'Priorize esta categoria na próxima compra',
        impact: 'Mantém sua despensa equilibrada',
      })
    }

    const possiblyUnneededProducts = products.filter((product) => {
      const percentage =
        (product.stock.currentQuantity / product.stock.desiredQuantity) * 100
      return percentage > 200 && product.stock.desiredQuantity <= 3
    })

    if (possiblyUnneededProducts.length > 0) {
      insights.push({
        id: 'possibly-unneeded',
        type: 'usage_pattern',
        title: 'Produtos que talvez não precisa mais',
        description: `${possiblyUnneededProducts.length} produtos têm estoque muito alto há tempo`,
        priority: 'low',
        productIds: possiblyUnneededProducts.map((p) => p.id),
        action: 'Considere usar primeiro ou reduzir quantidade',
        impact: 'Libera espaço para outros produtos',
      })
    }

    return insights.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  const insights = generateInsights()

  const toggleExpanded = (insightId: string) => {
    setExpandedInsights((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(insightId)) {
        newSet.delete(insightId)
      } else {
        newSet.add(insightId)
      }
      return newSet
    })
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'critical_alert':
        return <AlertTriangle className="h-5 w-5" />
      case 'low_alert':
        return <TrendingDown className="h-5 w-5" />
      case 'reorder_point':
        return <ShoppingCart className="h-5 w-5" />
      case 'overstock':
        return <Package className="h-5 w-5" />
      case 'category_optimization':
        return <Tag className="h-5 w-5" />
      case 'usage_pattern':
        return <BarChart3 className="h-5 w-5" />
      default:
        return <Lightbulb className="h-5 w-5" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'critical_alert':
        return 'bg-red-50 border-red-200 text-red-700 dark:bg-red-950 dark:border-red-800 dark:text-red-300'
      case 'low_alert':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-300'
      case 'reorder_point':
        return 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300'
      case 'overstock':
        return 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950 dark:border-purple-800 dark:text-purple-300'
      case 'category_optimization':
        return 'bg-green-50 border-green-200 text-green-700 dark:bg-green-950 dark:border-green-800 dark:text-green-300'
      case 'usage_pattern':
        return 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-950 dark:border-orange-800 dark:text-orange-300'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-300'
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return {
          text: 'Urgente',
          color: 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200',
        }
      case 'high':
        return {
          text: 'Atenção',
          color:
            'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200',
        }
      case 'medium':
        return {
          text: 'Médio',
          color:
            'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200',
        }
      case 'low':
        return {
          text: 'Baixo',
          color:
            'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
        }
      default:
        return {
          text: 'Info',
          color:
            'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
        }
    }
  }

  if (insights.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            Insights da sua despensa
          </CardTitle>
          <CardDescription>
            Tudo está equilibrado! Não há observações no momento.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="h-5 w-5 text-blue-600" />
          Insights da sua despensa
        </CardTitle>
        <CardDescription>
          {insights.length} observação{insights.length > 1 ? 'ões' : ''} sobre
          seus produtos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight) => {
          const isExpanded = expandedInsights.has(insight.id)
          const relatedProducts = products.filter((p) =>
            insight.productIds.includes(p.id),
          )

          return (
            <div key={insight.id} className="space-y-2">
              <button
                onClick={() => toggleExpanded(insight.id)}
                className={`w-full p-4 border rounded-lg transition-all duration-200 hover:shadow-md ${getInsightColor(insight.type)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-white/50 rounded-full">
                      {getInsightIcon(insight.type)}
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-base">
                        {insight.title}
                      </h4>
                      <p className="text-sm opacity-80">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getPriorityBadge(insight.priority).color}`}
                    >
                      {getPriorityBadge(insight.priority).text}
                    </span>
                    <span className="text-xs px-2 py-1 bg-white/50 rounded-full">
                      {relatedProducts.length} produto
                      {relatedProducts.length > 1 ? 's' : ''}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="ml-4 space-y-3">
                  <div className="p-3 bg-white/50 rounded-lg border">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400">
                          💡
                        </span>
                        <span>
                          <strong>Dica:</strong> {insight.action}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400">
                          ✨
                        </span>
                        <span>
                          <strong>Benefício:</strong> {insight.impact}
                        </span>
                      </div>
                    </div>
                  </div>

                  {relatedProducts.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        {insight.type === 'critical_alert' ||
                        insight.type === 'low_alert'
                          ? 'Produtos que precisam de atenção:'
                          : 'Produtos relacionados:'}
                      </p>
                      <div className="grid gap-2">
                        {relatedProducts.slice(0, 3).map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center justify-between p-2 bg-white border rounded text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-current rounded-full opacity-50"></div>
                              <span className="font-medium">
                                {product.name}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {product.category.name}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">
                                {product.stock.currentQuantity}/
                                {product.stock.desiredQuantity} {product.unit}
                              </span>
                              {(insight.type === 'critical_alert' ||
                                insight.type === 'low_alert') &&
                                onQuickRestock && (
                                  <>
                                    <button
                                      onClick={() =>
                                        onQuickRestock(
                                          product.id,
                                          getSuggestedRestockQuantity(product),
                                        )
                                      }
                                      className="flex items-center justify-center w-6 h-6 bg-current text-white rounded-full transition-colors hover:opacity-80"
                                      title={`Adicionar ${getSuggestedRestockQuantity(product)} ${product.unit}`}
                                    >
                                      <Plus className="h-3 w-3" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDismissAlert(product.id)
                                      }
                                      className="flex items-center justify-center w-6 h-6 text-current hover:bg-current/10 rounded-full transition-colors"
                                      title="Dispensar alerta"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </>
                                )}
                            </div>
                          </div>
                        ))}
                        {relatedProducts.length > 3 && (
                          <p className="text-xs text-center text-muted-foreground py-1">
                            +{relatedProducts.length - 3} outros produtos
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
