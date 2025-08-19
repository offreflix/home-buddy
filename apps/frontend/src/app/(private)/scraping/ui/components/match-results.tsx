import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ShoppingCart,
  Package,
  Plus,
  Check,
  X,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { ProductMatch, ProductScrap } from '../../scraping.type'

interface MatchResultsProps {
  matchResult: {
    match: ProductMatch[]
    unmatch: ProductScrap[]
  }
  onAcceptMatch: (match: ProductMatch) => void
  onRejectMatch: (match: ProductMatch) => void
  onCreateProduct: (product: ProductScrap) => void
  onSelectExistingProduct: (product: ProductScrap, productId: string) => void
  acceptedMatches?: Set<string>
  rejectedMatches?: Set<string>
  isAcceptingProduct?: boolean
  isCreatingProduct?: boolean
  scrapedData?: any
  availableProducts?: any[]
  availableCategories?: any[]
}

export function MatchResults({
  matchResult,
  onAcceptMatch,
  onRejectMatch,
  onCreateProduct,
  onSelectExistingProduct,
  acceptedMatches = new Set(),
  rejectedMatches = new Set(),
  isAcceptingProduct = false,
  isCreatingProduct = false,
  scrapedData,
  availableProducts = [],
  availableCategories = [],
}: MatchResultsProps) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800'
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'Alto'
    if (confidence >= 0.6) return 'Médio'
    return 'Baixo'
  }

  const getScrapedProduct = (scrapTitle: string) => {
    return scrapedData?.products?.find(
      (product: any) => product.title === scrapTitle,
    )
  }

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    return isNaN(numPrice)
      ? 'N/A'
      : `R$ ${numPrice.toFixed(2).replace('.', ',')}`
  }

  const formatQuantity = (quantity: string, unit?: string) => {
    if (!quantity) return 'N/A'
    return unit ? `${quantity} ${unit}` : quantity
  }

  return (
    <div className="space-y-6">
      {/* Matches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Produtos Encontrados
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {matchResult.match.length}
            </Badge>
          </CardTitle>
          <CardDescription>
            Produtos que foram identificados como correspondentes aos seus
            produtos existentes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {matchResult.match.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Nenhum produto correspondente encontrado
            </p>
          ) : (
            matchResult.match.map((match, index) => {
              const scrapedProduct = getScrapedProduct(match.scrap_title)
              const isAccepted = acceptedMatches.has(match.scrap_title)
              const isRejected = rejectedMatches.has(match.scrap_title)

              return (
                <Card key={index} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-4 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 flex-1 min-w-0">
                        <h4 className="font-semibold text-base leading-tight truncate">
                          {match.scrap_title}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <ShoppingCart className="h-4 w-4" />
                          <span>
                            Produto ID:{' '}
                            <span className="font-medium text-primary">
                              {match.product_id}
                            </span>
                          </span>
                        </div>
                        <StatusBadge
                          type="confidence"
                          confidence={match.confidence}
                        >
                          {getConfidenceText(match.confidence)} (
                          {Math.round(match.confidence * 100)}%)
                        </StatusBadge>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        {isAccepted ? (
                          <StatusBadge type="accepted">Aceito</StatusBadge>
                        ) : isRejected ? (
                          <StatusBadge type="rejected">Rejeitado</StatusBadge>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              onClick={() => onAcceptMatch(match)}
                              disabled={isAcceptingProduct}
                              className="h-8"
                            >
                              {isAcceptingProduct ? (
                                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                              ) : (
                                <Check className="h-3 w-3 mr-1" />
                              )}
                              {isAcceptingProduct ? 'Aceitando...' : 'Aceitar'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onRejectMatch(match)}
                              disabled={isAcceptingProduct}
                              className="h-8"
                            >
                              <X className="h-3 w-3 mr-1" />
                              Recusar
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Product Info */}
                    <ProductInfo
                      product={scrapedProduct}
                      formatPrice={formatPrice}
                      formatQuantity={formatQuantity}
                      title="Produto Escaneado"
                    />

                    {/* Action Preview */}
                    {!isAccepted && !isRejected && (
                      <>
                        <Separator />
                        <div className="bg-blue-50/50 border border-blue-200/50 dark:border-blue-900 dark:bg-blue-950 p-3 rounded-lg">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                Ação ao aceitar
                              </p>
                              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                Será adicionado{' '}
                                <span className="font-semibold">
                                  {formatQuantity(
                                    scrapedProduct?.quantity,
                                    scrapedProduct?.unit,
                                  )}
                                </span>{' '}
                                ao estoque do produto
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )
            })
          )}
        </CardContent>
      </Card>

      {/* Produtos Não Identificados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Produtos Não Identificados
            <Badge
              variant="secondary"
              className="bg-orange-100 text-orange-800"
            >
              {matchResult.unmatch.length + Array.from(rejectedMatches).length}
            </Badge>
          </CardTitle>
          <CardDescription>
            Produtos que não foram identificados automaticamente ou foram
            rejeitados. Você pode vincular a um produto existente ou criar um
            novo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {matchResult.unmatch.length === 0 && rejectedMatches.size === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Todos os produtos foram identificados
            </p>
          ) : (
            <>
              {/* Produtos unmatch originais */}
              {matchResult.unmatch.map((product, index) => {
                const scrapedProduct = getScrapedProduct(product.title)
                const isProcessed = acceptedMatches.has(product.title)

                return (
                  <UnmatchedProductCard
                    key={`unmatch-${index}`}
                    product={product}
                    scrapedProduct={scrapedProduct}
                    isProcessed={isProcessed}
                    onCreateProduct={onCreateProduct}
                    onSelectExistingProduct={onSelectExistingProduct}
                    formatPrice={formatPrice}
                    formatQuantity={formatQuantity}
                    availableProducts={availableProducts}
                    availableCategories={availableCategories}
                    isCreatingProduct={isCreatingProduct}
                  />
                )
              })}

              {/* Produtos rejeitados */}
              {Array.from(rejectedMatches).map((rejectedTitle, index) => {
                const scrapedProduct = getScrapedProduct(rejectedTitle)
                const productScrap: ProductScrap = {
                  title: rejectedTitle,
                  code: scrapedProduct?.code,
                  quantity: scrapedProduct?.quantity,
                  unit: scrapedProduct?.unit,
                  unitPrice: scrapedProduct?.unitPrice,
                  totalPrice: scrapedProduct?.totalPrice,
                }
                const isProcessed = acceptedMatches.has(rejectedTitle)

                return (
                  <UnmatchedProductCard
                    key={`rejected-${index}`}
                    product={productScrap}
                    scrapedProduct={scrapedProduct}
                    isProcessed={isProcessed}
                    isRejected={true}
                    onCreateProduct={onCreateProduct}
                    onSelectExistingProduct={onSelectExistingProduct}
                    formatPrice={formatPrice}
                    formatQuantity={formatQuantity}
                    availableProducts={availableProducts}
                    availableCategories={availableCategories}
                    isCreatingProduct={isCreatingProduct}
                  />
                )
              })}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface ProductInfoProps {
  product: any
  formatPrice: (price: string | number) => string
  formatQuantity: (quantity: string, unit?: string) => string
  title?: string
}

function ProductInfo({
  product,
  formatPrice,
  formatQuantity,
  title = 'Informações do Produto',
}: ProductInfoProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Package className="h-4 w-4 text-muted-foreground" />
        <h5 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
          {title}
        </h5>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Código</Label>
          <p className="text-sm font-medium">{product?.code || 'N/A'}</p>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Quantidade</Label>
          <p className="text-sm font-medium">
            {formatQuantity(product?.quantity, product?.unit)}
          </p>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Preço Unit.</Label>
          <p className="text-sm font-medium">
            {formatPrice(product?.unitPrice || 0)}
          </p>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Total</Label>
          <p className="text-sm font-bold text-primary">
            {formatPrice(product?.totalPrice || 0)}
          </p>
        </div>
      </div>
    </div>
  )
}

interface StatusBadgeProps {
  type: 'accepted' | 'rejected' | 'processed' | 'confidence'
  confidence?: number
  children?: React.ReactNode
}

function StatusBadge({ type, confidence, children }: StatusBadgeProps) {
  const variants = {
    accepted:
      'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
    rejected:
      'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
    processed:
      'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
    confidence:
      confidence && confidence >= 0.8
        ? 'bg-green-50 text-green-700 border-green-200'
        : confidence && confidence >= 0.6
          ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
          : 'bg-red-50 text-red-700 border-red-200',
  }

  const icons = {
    accepted: <Check className="h-3 w-3" />,
    rejected: <X className="h-3 w-3" />,
    processed: <Check className="h-3 w-3" />,
    confidence: <AlertCircle className="h-3 w-3" />,
  }

  return (
    <Badge
      variant="outline"
      className={`${variants[type]} flex items-center gap-1`}
    >
      {icons[type]}
      {children}
    </Badge>
  )
}

interface UnmatchedProductCardProps {
  product: ProductScrap
  scrapedProduct: any
  isProcessed: boolean
  isRejected?: boolean
  onCreateProduct: (product: ProductScrap) => void
  onSelectExistingProduct: (product: ProductScrap, productId: string) => void
  formatPrice: (price: string | number) => string
  formatQuantity: (quantity: string, unit?: string) => string
  availableProducts: any[]
  availableCategories: any[]
  isCreatingProduct?: boolean
}

function UnmatchedProductCard({
  product,
  scrapedProduct,
  isProcessed,
  isRejected = false,
  onCreateProduct,
  onSelectExistingProduct,
  formatPrice,
  formatQuantity,
  availableProducts,
  availableCategories,
  isCreatingProduct = false,
}: UnmatchedProductCardProps) {
  const [showProductSelector, setShowProductSelector] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [customProductName, setCustomProductName] = useState(product.title)
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [selectedUnit, setSelectedUnit] = useState('unidade')

  const handleSelectProduct = () => {
    if (selectedProductId) {
      onSelectExistingProduct(product, selectedProductId)
      setShowProductSelector(false)
      setSelectedProductId('')
    }
  }

  const handleCreateProduct = () => {
    if (customProductName.trim() && selectedCategoryId && selectedUnit) {
      const customProduct = {
        ...product,
        title: customProductName.trim(),
        categoryId: parseInt(selectedCategoryId),
        unit: selectedUnit,
      }
      onCreateProduct(customProduct)
      setShowCreateForm(false)
      setCustomProductName(product.title)
      setSelectedCategoryId('')
      setSelectedUnit('unidade')
    }
  }

  const handleCancelCreate = () => {
    setShowCreateForm(false)
    setCustomProductName(product.title)
    setSelectedCategoryId('')
    setSelectedUnit('unidade')
  }

  const handleCancelSelect = () => {
    setShowProductSelector(false)
    setSelectedProductId('')
  }

  return (
    <Card
      className={`hover:shadow-sm transition-shadow ${isRejected ? 'border-orange-200 bg-orange-50/30 dark:border-orange-900 dark:bg-orange-950' : ''}`}
    >
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-base leading-tight">
                {product.title}
              </h4>
              {isRejected && (
                <StatusBadge type="rejected">Rejeitado</StatusBadge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Produto não identificado automaticamente
            </p>
          </div>

          <div className="flex gap-2 shrink-0">
            {isProcessed ? (
              <StatusBadge type="processed">Processado</StatusBadge>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowProductSelector(!showProductSelector)
                    if (showCreateForm) setShowCreateForm(false)
                  }}
                  disabled={isCreatingProduct}
                  className="h-8"
                >
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  Vincular
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setShowCreateForm(!showCreateForm)
                    if (showProductSelector) setShowProductSelector(false)
                  }}
                  disabled={isCreatingProduct}
                  className="h-8"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Criar
                </Button>
              </>
            )}
          </div>
        </div>

        <Separator />

        {/* Product Info */}
        <ProductInfo
          product={scrapedProduct}
          formatPrice={formatPrice}
          formatQuantity={formatQuantity}
          title="Produto Escaneado"
        />

        {/* Create Product Form */}
        {showCreateForm && !isProcessed && (
          <>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4 text-muted-foreground" />
                <h5 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Criar Novo Produto
                </h5>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label
                      htmlFor="product-name"
                      className="text-sm font-medium"
                    >
                      Nome do Produto
                    </Label>
                    <Input
                      id="product-name"
                      value={customProductName}
                      onChange={(e) => setCustomProductName(e.target.value)}
                      onKeyDown={(e) => {
                        if (
                          e.key === 'Enter' &&
                          customProductName.trim() &&
                          selectedCategoryId &&
                          selectedUnit &&
                          !isCreatingProduct
                        ) {
                          handleCreateProduct()
                        }
                      }}
                      placeholder="Digite o nome do produto..."
                      disabled={isCreatingProduct}
                      autoFocus
                      className="h-9"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="product-category"
                      className="text-sm font-medium"
                    >
                      Categoria
                    </Label>
                    <Select
                      value={selectedCategoryId}
                      onValueChange={setSelectedCategoryId}
                      disabled={isCreatingProduct}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Selecione uma categoria..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCategories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product-unit" className="text-sm font-medium">
                    Unidade
                  </Label>
                  <Select
                    value={selectedUnit}
                    onValueChange={setSelectedUnit}
                    disabled={isCreatingProduct}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Selecione uma unidade..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="g">g</SelectItem>
                      <SelectItem value="L">L</SelectItem>
                      <SelectItem value="lata">lata</SelectItem>
                      <SelectItem value="pacote">pacote</SelectItem>
                      <SelectItem value="unidade">unidade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleCreateProduct}
                    disabled={
                      !customProductName.trim() ||
                      !selectedCategoryId ||
                      !selectedUnit ||
                      isCreatingProduct
                    }
                    className="h-8"
                  >
                    {isCreatingProduct ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    ) : (
                      <Check className="h-3 w-3 mr-1" />
                    )}
                    {isCreatingProduct ? 'Criando...' : 'Criar'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelCreate}
                    disabled={isCreatingProduct}
                    className="h-8"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Cancelar
                  </Button>
                </div>

                {customProductName.trim() &&
                  selectedCategoryId &&
                  selectedUnit && (
                    <div className="bg-green-50/50 border border-green-200/50 p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-green-900">
                            Preview do Produto
                          </p>
                          <div className="text-sm text-green-700 mt-1 space-y-1">
                            <p>
                              <span className="font-semibold">Nome:</span> "
                              {customProductName}"
                            </p>
                            <p>
                              <span className="font-semibold">Categoria:</span>{' '}
                              {availableCategories.find(
                                (c) => c.id.toString() === selectedCategoryId,
                              )?.name || 'N/A'}
                            </p>
                            <p>
                              <span className="font-semibold">Unidade:</span>{' '}
                              {selectedUnit}
                            </p>
                            <p>
                              <span className="font-semibold">
                                Estoque inicial:
                              </span>{' '}
                              {formatQuantity(
                                scrapedProduct?.quantity,
                                scrapedProduct?.unit,
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </>
        )}

        {/* Product Selector */}
        {showProductSelector && !isProcessed && (
          <>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                <h5 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Vincular a Produto Existente
                </h5>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label
                    htmlFor="product-select"
                    className="text-sm font-medium"
                  >
                    Selecionar Produto
                  </Label>
                  <Select
                    value={selectedProductId}
                    onValueChange={setSelectedProductId}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Escolha um produto..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProducts.map((prod) => (
                        <SelectItem key={prod.id} value={prod.id}>
                          {prod.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleSelectProduct}
                    disabled={!selectedProductId}
                    className="h-8"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Vincular
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelSelect}
                    className="h-8"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Cancelar
                  </Button>
                </div>

                {selectedProductId && (
                  <div className="bg-blue-50/50 border border-blue-200/50 p-3 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">
                          Preview
                        </p>
                        <p className="text-sm text-blue-700 mt-1">
                          Será adicionado{' '}
                          <span className="font-semibold">
                            {formatQuantity(
                              scrapedProduct?.quantity,
                              scrapedProduct?.unit,
                            )}
                          </span>{' '}
                          ao estoque do produto selecionado
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
