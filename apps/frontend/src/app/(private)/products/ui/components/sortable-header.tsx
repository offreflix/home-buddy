import { Button } from '@/components/ui/button'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

interface SortableHeaderProps {
  label: string
  sortBy: string
  currentSortBy: string
  currentSortOrder: 'asc' | 'desc'
  onSortingChange: (sortBy: string) => void
}

export function SortableHeader({
  label,
  sortBy,
  currentSortBy,
  currentSortOrder,
  onSortingChange,
}: SortableHeaderProps) {
  const getSortIcon = () => {
    if (currentSortBy !== sortBy) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />
    }

    if (currentSortOrder === 'asc') {
      return <ArrowUp className="ml-2 h-4 w-4" />
    }

    return <ArrowDown className="ml-2 h-4 w-4" />
  }

  const getSortIndicator = () => {
    if (currentSortBy !== sortBy) {
      return 'text-muted-foreground'
    }

    return 'text-foreground'
  }

  return (
    <Button
      variant="ghost"
      onClick={() => onSortingChange(sortBy)}
      className={`hover:bg-accent ${getSortIndicator()}`}
    >
      {label}
      {getSortIcon()}
    </Button>
  )
}
