'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Search,
  X,
  Clock,
  ShoppingBasket,
  Upload,
  LayoutDashboard,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface SearchResult {
  id: string
  title: string
  description: string
  type: 'product' | 'category' | 'page'
  url: string
  icon: React.ComponentType<{ className?: string }>
}

const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    title: 'Arroz Integral',
    description: 'Produto com estoque baixo (5 unidades)',
    type: 'product',
    url: '/products',
    icon: ShoppingBasket,
  },
  {
    id: '2',
    title: 'Cereais',
    description: 'Categoria de produtos',
    type: 'category',
    url: '/products?category=cereais',
    icon: ShoppingBasket,
  },
  {
    id: '3',
    title: 'Dashboard',
    description: 'Visão geral do sistema',
    type: 'page',
    url: '/',
    icon: LayoutDashboard,
  },
  {
    id: '4',
    title: 'Scraping',
    description: 'Gerenciar scraping de produtos',
    type: 'page',
    url: '/scraping',
    icon: Upload,
  },
]

interface GlobalSearchProps {
  className?: string
}

export function GlobalSearch({ className }: GlobalSearchProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [recentSearches] = useState(['arroz', 'cereais', 'dashboard'])
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredResults = mockSearchResults.filter(
    (result) =>
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelect = (result: SearchResult) => {
    setOpen(false)
    setSearchQuery('')
    console.log('Navegar para:', result.url)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log('Buscar:', searchQuery)
      setOpen(false)
    }
  }

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'justify-start text-sm text-muted-foreground w-full max-w-sm lg:max-w-md',
            className,
          )}
        >
          <Search className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">
            Buscar produtos, categorias...
          </span>
          <span className="sm:hidden">Buscar...</span>
          <Badge variant="secondary" className="ml-auto text-xs">
            ⌘K
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] lg:w-[400px] p-0" align="start">
        <Command>
          <form onSubmit={handleSubmit}>
            <CommandInput
              ref={inputRef}
              placeholder="Digite para buscar..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="border-0 focus:ring-0"
            />
          </form>
          <CommandList>
            {searchQuery === '' && (
              <>
                <CommandGroup heading="Buscas recentes">
                  {recentSearches.map((search, index) => (
                    <CommandItem
                      key={index}
                      onSelect={() => setSearchQuery(search)}
                      className="flex items-center gap-2"
                    >
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{search}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandGroup heading="Navegação rápida">
                  {mockSearchResults.slice(0, 3).map((result) => (
                    <CommandItem
                      key={result.id}
                      onSelect={() => handleSelect(result)}
                      className="flex items-center gap-2"
                    >
                      <result.icon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="font-medium">{result.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {result.description}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {searchQuery !== '' && (
              <>
                {filteredResults.length > 0 ? (
                  <CommandGroup heading="Resultados da busca">
                    {filteredResults.map((result) => (
                      <CommandItem
                        key={result.id}
                        onSelect={() => handleSelect(result)}
                        className="flex items-center gap-2"
                      >
                        <result.icon className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span className="font-medium">{result.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {result.description}
                          </span>
                        </div>
                        <Badge variant="outline" className="ml-auto text-xs">
                          {result.type === 'product'
                            ? 'Produto'
                            : result.type === 'category'
                              ? 'Categoria'
                              : 'Página'}
                        </Badge>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ) : (
                  <CommandEmpty>
                    <div className="flex flex-col items-center gap-2 py-6 text-center">
                      <Search className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Nenhum resultado encontrado para "{searchQuery}"
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Tente usar termos diferentes ou verifique a ortografia
                      </p>
                    </div>
                  </CommandEmpty>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
