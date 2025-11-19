import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  )
}

// Componente customizado para campos numéricos que segue o padrão shadcn
function NumberInput<TFieldName extends string>({
  field,
  className,
  ...props
}: {
  field: {
    name: TFieldName
    value: unknown
    onChange: (value: unknown) => void
    onBlur: () => void
    ref: React.Ref<HTMLInputElement>
  }
  className?: string
} & Omit<React.ComponentProps<'input'>, 'field' | 'onChange'>) {
  return (
    <Input
      type="number"
      className={cn(className)}
      {...props}
      name={field.name}
      onBlur={field.onBlur}
      ref={field.ref}
      value={field.value?.toString() ?? ''}
      onChange={(e) => {
        const value = e.target.value === '' ? undefined : Number(e.target.value)
        field.onChange(value)
      }}
    />
  )
}

export { Input, NumberInput }
