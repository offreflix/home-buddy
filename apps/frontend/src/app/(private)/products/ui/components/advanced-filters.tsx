'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X, Filter } from 'lucide-react'
import { ProductFilters, Unit } from '../../products.type'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/api/client'

interface AdvancedFiltersProps {
  filters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
  onClearFilters: () => void
}

export function AdvancedFilters({
  filters,
  onFiltersChange,
  onClearFilters,
}: AdvancedFiltersProps) {
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () =>
      apiClient.get('/categories?perPage=0').then((res) => res.data),
  })

  const hasActiveFilters =
    filters.search ||
    filters.categoryId !== 'all' ||
    filters.stockStatus !== 'all' ||
    filters.unit !== 'all'

  const activeFiltersCount = [
    filters.search,
    filters.categoryId !== 'all' ? filters.categoryId : null,
    filters.stockStatus !== 'all' ? filters.stockStatus : null,
    filters.unit !== 'all' ? filters.unit : null,
  ].filter(Boolean).length

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Busca por nome */}
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Buscar produtos..."
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="w-full"
          />
        </div>

        {/* Filtro por categoria */}
        <Select
          value={filters.categoryId}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, categoryId: value })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categoriesQuery.data?.data?.map((category: any) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filtro por status do estoque */}
        <Select
          value={filters.stockStatus}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, stockStatus: value })
          }
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="critical">Crítico</SelectItem>
            <SelectItem value="low">Baixo</SelectItem>
            <SelectItem value="adequate">Adequado</SelectItem>
            <SelectItem value="high">Alto</SelectItem>
          </SelectContent>
        </Select>

        {/* Filtro por unidade */}
        <Select
          value={filters.unit}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, unit: value })
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Unidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {Object.values(Unit).map((unit) => (
              <SelectItem key={unit} value={unit}>
                {unit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Botão para limpar filtros */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Limpar
          </Button>
        )}
      </div>

      {/* Indicador de filtros ativos */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {activeFiltersCount} filtro{activeFiltersCount > 1 ? 's' : ''}{' '}
              ativo{activeFiltersCount > 1 ? 's' : ''}:
            </span>
          </div>

          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Busca: "{filters.search}"
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onFiltersChange({ ...filters, search: '' })}
              />
            </Badge>
          )}

          {filters.categoryId !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Categoria:{' '}
              {
                categoriesQuery.data?.data?.find(
                  (c: any) => c.id.toString() === filters.categoryId,
                )?.name
              }
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  onFiltersChange({ ...filters, categoryId: 'all' })
                }
              />
            </Badge>
          )}

          {filters.stockStatus !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Status: {filters.stockStatus}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  onFiltersChange({ ...filters, stockStatus: 'all' })
                }
              />
            </Badge>
          )}

          {filters.unit !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Unidade: {filters.unit}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onFiltersChange({ ...filters, unit: 'all' })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
