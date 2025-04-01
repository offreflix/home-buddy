'use client'

import { Button } from '@/components/ui/button'
import { PackagePlus } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
  buttonText?: string
  onClick?: () => void
}

export function EmptyState({
  title = 'Nenhum produto cadastrado',
  description = 'Você ainda não possui produtos cadastrados no sistema.',
  buttonText = 'Adicionar primeiro produto',
  onClick,
}: EmptyStateProps) {
  return (
    <div className="border rounded-lg hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200 flex flex-col items-center justify-center w-full h-full py-12 px-4 space-y-6">
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="rounded-full p-3 bg-primary/10">
          <PackagePlus className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-medium">{title}</h3>
        <p className="text-muted-foreground text-sm max-w-[350px]">
          {description}
        </p>
      </div>

      <Button onClick={onClick} className="gap-2">
        <PackagePlus className="h-4 w-4" />
        {buttonText}
      </Button>
    </div>
  )
}
