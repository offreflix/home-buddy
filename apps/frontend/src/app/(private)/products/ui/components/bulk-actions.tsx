'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import {
  ChevronDown,
  Trash2,
  Edit3,
  Package,
  Download,
  CheckSquare,
  Square,
} from 'lucide-react'
import { Product } from '../../products.type'
import { toast } from 'sonner'

interface BulkActionsProps {
  selectedProducts: Product[]
  onSelectAll: () => void
  onDeselectAll: () => void
  onBulkDelete: (productIds: number[]) => void
  onBulkCategoryChange: (productIds: number[], categoryId: number) => void
  onBulkExport: (products: Product[]) => void
  totalProducts: number
  allSelected: boolean
}

export function BulkActions({
  selectedProducts,
  onSelectAll,
  onDeselectAll,
  onBulkDelete,
  onBulkCategoryChange,
  onBulkExport,
  totalProducts,
  allSelected,
}: BulkActionsProps) {
  const selectedCount = selectedProducts.length
  const hasSelection = selectedCount > 0

  const handleBulkDelete = () => {
    if (selectedCount === 0) return

    const productIds = selectedProducts.map((p) => p.id)
    onBulkDelete(productIds)
    toast.success(
      `${selectedCount} produto${selectedCount > 1 ? 's' : ''} removido${selectedCount > 1 ? 's' : ''}`,
    )
  }

  const handleExport = () => {
    if (selectedCount === 0) return
    onBulkExport(selectedProducts)
    toast.success('Dados exportados com sucesso')
  }

  if (!hasSelection) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onSelectAll}
          className="flex items-center gap-2"
        >
          <CheckSquare className="h-4 w-4" />
          Selecionar todos ({totalProducts})
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onDeselectAll}
          className="flex items-center gap-2"
        >
          <Square className="h-4 w-4" />
          Desmarcar todos
        </Button>

        <Badge variant="secondary" className="font-medium">
          {selectedCount} selecionado{selectedCount > 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="flex items-center gap-1 ml-auto">
        {/* Ações individuais */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Exportar
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleBulkDelete}
          className="flex items-center gap-2 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          Excluir
        </Button>

        {/* Menu de ações avançadas */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Mais ações <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                // TODO: Implementar mudança de categoria em massa
                toast.info('Funcionalidade em desenvolvimento')
              }}
            >
              <Edit3 className="mr-2 h-4 w-4" />
              Alterar categoria
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                // TODO: Implementar ajuste de estoque em massa
                toast.info('Funcionalidade em desenvolvimento')
              }}
            >
              <Package className="mr-2 h-4 w-4" />
              Ajustar estoque
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                // TODO:Implementar duplicação em massa
                toast.info('Funcionalidade em desenvolvimento')
              }}
            >
              <CheckSquare className="mr-2 h-4 w-4" />
              Duplicar produtos
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
