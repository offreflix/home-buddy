'use client'

import * as React from 'react'
import { Calculator, Calendar, CreditCard, Settings, Smile, User, Search } from 'lucide-react'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useModalStore } from '@/app/(private)/products/modal.store'
import { apiClient } from '@/api/client'
import { Product } from '@/app/(private)/products/products.type'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '@/hooks/use-debounce'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState<{name: string, count: number} | null>(null)
  const debouncedSearch = useDebounce(search, 300)
  const router = useRouter()
  const { toggleViewModal, setViewingProduct, toggleAddModal } = useModalStore()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['global-search', debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch) return { products: [], categories: [] }
      
      const [productsRes, categoriesRes] = await Promise.all([
        apiClient.get('/products', {
          params: { search: debouncedSearch, perPage: 5 },
        }),
        apiClient.get('/products/count-by-category')
      ])

      const allCategories = categoriesRes.data as { id: number, name: string, count: number }[]
      const filteredCategories = allCategories.filter(c => 
        c.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
      
      return {
        products: productsRes.data.data as Product[],
        categories: filteredCategories
      }
    },
    enabled: open && debouncedSearch.length > 0,
  })

  const handleSelectProduct = (product: Product) => {
    setOpen(false)
    router.push('/products')
    setTimeout(() => {
      setViewingProduct(product)
      toggleViewModal()
    }, 100)
  }

  const handleSelectCategory = (category: { name: string, count: number }) => {
    setOpen(false)
    setSelectedCategory(category)
  }

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-[0.5rem] text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">Buscar produtos...</span>
        <span className="inline-flex lg:hidden">Buscar...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Digite o nome do produto ou categoria..." 
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty>
            <div className="flex flex-col items-center gap-2 p-4">
              <p className="text-sm text-muted-foreground">Nenhum resultado encontrado.</p>
              <div className="flex gap-2 mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setOpen(false)
                    router.push('/products')
                    setTimeout(() => toggleAddModal(), 100)
                  }}
                >
                  Criar Produto
                </Button>
              </div>
            </div>
          </CommandEmpty>
          
          {isLoading ? (
             <div className="p-4 text-sm text-center text-muted-foreground">Buscando...</div>
          ) : (
            <>
              {searchResults?.products && searchResults.products.length > 0 && (
                <CommandGroup heading="Produtos">
                  {searchResults.products.map((product) => (
                    <CommandItem
                      key={product.id}
                      value={`product-${product.id}-${product.name}`}
                      onSelect={() => handleSelectProduct(product)}
                    >
                      <Search className="mr-2 h-4 w-4" />
                      <span>{product.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({product.category.name})
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {searchResults?.categories && searchResults.categories.length > 0 && (
                <CommandGroup heading="Categorias">
                  {searchResults.categories.map((category) => (
                    <CommandItem
                      key={category.id}
                      value={`category-${category.id}-${category.name}`}
                      onSelect={() => handleSelectCategory(category)}
                    >
                      <Search className="mr-2 h-4 w-4" />
                      <span>{category.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({category.count} produtos)
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </>
          )}
        </CommandList>
      </CommandDialog>

      <Dialog open={!!selectedCategory} onOpenChange={(open) => !open && setSelectedCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Categoria: {selectedCategory?.name}</DialogTitle>
            <DialogDescription>
              Esta categoria possui atualmente <strong>{selectedCategory?.count}</strong> produtos cadastrados.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}
