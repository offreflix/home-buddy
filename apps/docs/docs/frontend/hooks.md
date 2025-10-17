---
id: hooks
title: Custom Hooks
sidebar_position: 3
description: Custom hooks e gerenciamento de estado do Home Buddy
keywords: [hooks, react, estado, zustand, react-query, home buddy]
---

# 🪝 Custom Hooks

O Home Buddy utiliza uma combinação de React Query para cache e sincronização de dados, Zustand para estado global, e custom hooks para encapsular lógica reutilizável.

## 🏗️ Arquitetura de Estado

### **Estrutura de Hooks**

```
src/hooks/
├── 📁 api/                   # Hooks para API
│   ├── use-products.ts
│   ├── use-auth.ts
│   └── use-analytics.ts
├── 📁 ui/                    # Hooks para UI
│   ├── use-modal.ts
│   ├── use-toast.ts
│   └── use-theme.ts
├── 📁 business/              # Hooks de negócio
│   ├── use-product-tracking.ts
│   ├── use-price-alerts.ts
│   └── use-search.ts
└── 📁 common/                # Hooks comuns
    ├── use-local-storage.ts
    ├── use-debounce.ts
    └── use-intersection-observer.ts
```

## 🔌 Hooks de API

### **useProducts Hook**

```typescript
// src/hooks/api/use-products.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productsApi } from '@/lib/api/products'
import { toast } from '@/hooks/ui/use-toast'

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: productsApi.create,
    onSuccess: (newProduct) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast({
        title: 'Sucesso',
        description: 'Produto adicionado com sucesso!',
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Falha ao adicionar produto',
        variant: 'destructive',
      })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductData }) =>
      productsApi.update(id, data),
    onSuccess: (updatedProduct) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({
        queryKey: ['products', updatedProduct.id],
      })
      toast({
        title: 'Sucesso',
        description: 'Produto atualizado com sucesso!',
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Falha ao atualizar produto',
        variant: 'destructive',
      })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: productsApi.delete,
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.removeQueries({ queryKey: ['products', deletedId] })
      toast({
        title: 'Sucesso',
        description: 'Produto excluído com sucesso!',
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Falha ao excluir produto',
        variant: 'destructive',
      })
    },
  })
}
```

### **useAuth Hook**

```typescript
// src/hooks/api/use-auth.ts
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/ui/use-toast'

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const login = async (provider: 'google' = 'google') => {
    try {
      await signIn(provider, { callbackUrl: '/dashboard' })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao fazer login',
        variant: 'destructive',
      })
    }
  }

  const logout = async () => {
    try {
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao fazer logout',
        variant: 'destructive',
      })
    }
  }

  const requireAuth = () => {
    if (status === 'loading') return false
    if (!session) {
      router.push('/signin')
      return false
    }
    return true
  }

  return {
    user: session?.user,
    isAuthenticated: !!session,
    isLoading: status === 'loading',
    login,
    logout,
    requireAuth,
  }
}
```

### **useAnalytics Hook**

```typescript
// src/hooks/api/use-analytics.ts
import { useQuery } from '@tanstack/react-query'
import { analyticsApi } from '@/lib/api/analytics'

export function useDashboardStats() {
  return useQuery({
    queryKey: ['analytics', 'dashboard-stats'],
    queryFn: analyticsApi.getDashboardStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useSpendingChart(period: 'week' | 'month' | 'year' = 'month') {
  return useQuery({
    queryKey: ['analytics', 'spending-chart', period],
    queryFn: () => analyticsApi.getSpendingChart(period),
    staleTime: 15 * 60 * 1000, // 15 minutes
  })
}

export function useProductAnalytics(productId: string) {
  return useQuery({
    queryKey: ['analytics', 'product', productId],
    queryFn: () => analyticsApi.getProductAnalytics(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function usePriceHistory(productId: string) {
  return useQuery({
    queryKey: ['analytics', 'price-history', productId],
    queryFn: () => analyticsApi.getPriceHistory(productId),
    enabled: !!productId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
```

## 🎨 Hooks de UI

### **useModal Hook**

```typescript
// src/hooks/ui/use-modal.ts
import { useState, useCallback } from 'react'

interface UseModalReturn {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

export function useModal(initialState = false): UseModalReturn {
  const [isOpen, setIsOpen] = useState(initialState)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  return {
    isOpen,
    open,
    close,
    toggle,
  }
}

// Hook para múltiplos modais
export function useModals<T extends string>(
  initialState: Record<T, boolean> = {} as Record<T, boolean>,
) {
  const [modals, setModals] = useState<Record<T, boolean>>(initialState)

  const openModal = useCallback((modalName: T) => {
    setModals((prev) => ({ ...prev, [modalName]: true }))
  }, [])

  const closeModal = useCallback((modalName: T) => {
    setModals((prev) => ({ ...prev, [modalName]: false }))
  }, [])

  const toggleModal = useCallback((modalName: T) => {
    setModals((prev) => ({ ...prev, [modalName]: !prev[modalName] }))
  }, [])

  const isModalOpen = useCallback(
    (modalName: T) => modals[modalName] || false,
    [modals],
  )

  return {
    modals,
    openModal,
    closeModal,
    toggleModal,
    isModalOpen,
  }
}
```

### **useToast Hook**

```typescript
// src/hooks/ui/use-toast.ts
import { toast as sonnerToast } from 'sonner'

interface ToastOptions {
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'success' | 'warning'
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export function useToast() {
  const toast = (options: ToastOptions) => {
    const {
      title,
      description,
      variant = 'default',
      duration = 5000,
      action,
    } = options

    switch (variant) {
      case 'success':
        sonnerToast.success(title, {
          description,
          duration,
          action: action
            ? {
                label: action.label,
                onClick: action.onClick,
              }
            : undefined,
        })
        break
      case 'destructive':
        sonnerToast.error(title, {
          description,
          duration,
          action: action
            ? {
                label: action.label,
                onClick: action.onClick,
              }
            : undefined,
        })
        break
      case 'warning':
        sonnerToast.warning(title, {
          description,
          duration,
          action: action
            ? {
                label: action.label,
                onClick: action.onClick,
              }
            : undefined,
        })
        break
      default:
        sonnerToast(title, {
          description,
          duration,
          action: action
            ? {
                label: action.label,
                onClick: action.onClick,
              }
            : undefined,
        })
    }
  }

  return { toast }
}
```

### **useTheme Hook**

```typescript
// src/hooks/ui/use-theme.ts
import { useTheme as useNextTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useNextTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  const setLightTheme = () => setTheme('light')
  const setDarkTheme = () => setTheme('dark')
  const setSystemTheme = () => setTheme('system')

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    setSystemTheme,
    mounted,
  }
}
```

## 💼 Hooks de Negócio

### **useProductTracking Hook**

```typescript
// src/hooks/business/use-product-tracking.ts
import { useState, useEffect, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { productsApi } from '@/lib/api/products'
import { toast } from '@/hooks/ui/use-toast'

interface TrackingState {
  isTracking: boolean
  progress: number
  error: string | null
}

export function useProductTracking() {
  const [trackingState, setTrackingState] = useState<TrackingState>({
    isTracking: false,
    progress: 0,
    error: null,
  })

  const queryClient = useQueryClient()

  const startTracking = useMutation({
    mutationFn: productsApi.startTracking,
    onSuccess: (data) => {
      setTrackingState({
        isTracking: true,
        progress: 0,
        error: null,
      })

      // Simular progresso
      const interval = setInterval(() => {
        setTrackingState((prev) => {
          if (prev.progress >= 100) {
            clearInterval(interval)
            return {
              isTracking: false,
              progress: 100,
              error: null,
            }
          }
          return {
            ...prev,
            progress: prev.progress + 10,
          }
        })
      }, 500)

      // Limpar após 5 segundos
      setTimeout(() => {
        clearInterval(interval)
        setTrackingState((prev) => ({
          ...prev,
          isTracking: false,
          progress: 100,
        }))
        queryClient.invalidateQueries({ queryKey: ['products'] })
        toast({
          title: 'Sucesso',
          description: 'Rastreamento iniciado com sucesso!',
        })
      }, 5000)
    },
    onError: (error) => {
      setTrackingState({
        isTracking: false,
        progress: 0,
        error: error.message,
      })
      toast({
        title: 'Erro',
        description: 'Falha ao iniciar rastreamento',
        variant: 'destructive',
      })
    },
  })

  const stopTracking = useCallback(() => {
    setTrackingState({
      isTracking: false,
      progress: 0,
      error: null,
    })
  }, [])

  return {
    trackingState,
    startTracking: startTracking.mutate,
    stopTracking,
    isLoading: startTracking.isPending,
  }
}
```

### **usePriceAlerts Hook**

```typescript
// src/hooks/business/use-price-alerts.ts
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { alertsApi } from '@/lib/api/alerts'
import { toast } from '@/hooks/ui/use-toast'

export function usePriceAlerts() {
  const queryClient = useQueryClient()

  const { data: alerts, isLoading } = useQuery({
    queryKey: ['price-alerts'],
    queryFn: alertsApi.getAll,
  })

  const createAlert = useMutation({
    mutationFn: alertsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price-alerts'] })
      toast({
        title: 'Sucesso',
        description: 'Alerta de preço criado!',
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Falha ao criar alerta',
        variant: 'destructive',
      })
    },
  })

  const updateAlert = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      alertsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price-alerts'] })
      toast({
        title: 'Sucesso',
        description: 'Alerta atualizado!',
      })
    },
  })

  const deleteAlert = useMutation({
    mutationFn: alertsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price-alerts'] })
      toast({
        title: 'Sucesso',
        description: 'Alerta removido!',
      })
    },
  })

  return {
    alerts,
    isLoading,
    createAlert: createAlert.mutate,
    updateAlert: updateAlert.mutate,
    deleteAlert: deleteAlert.mutate,
  }
}
```

### **useSearch Hook**

```typescript
// src/hooks/business/use-search.ts
import { useState, useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { searchApi } from '@/lib/api/search'
import { useDebounce } from '@/hooks/common/use-debounce'

interface SearchFilters {
  query: string
  category?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'name' | 'price' | 'date'
  sortOrder?: 'asc' | 'desc'
}

export function useSearch(initialFilters: Partial<SearchFilters> = {}) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    ...initialFilters,
  })

  const debouncedQuery = useDebounce(filters.query, 300)

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['search', { ...filters, query: debouncedQuery }],
    queryFn: () => searchApi.search({ ...filters, query: debouncedQuery }),
    enabled: debouncedQuery.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const clearFilters = () => {
    setFilters({
      query: '',
      category: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: 'name',
      sortOrder: 'asc',
    })
  }

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(
      (value) => value !== '' && value !== undefined && value !== null,
    )
  }, [filters])

  return {
    filters,
    searchResults,
    isLoading,
    updateFilters,
    clearFilters,
    hasActiveFilters,
  }
}
```

## 🔧 Hooks Comuns

### **useLocalStorage Hook**

```typescript
// src/hooks/common/use-local-storage.ts
import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  const removeValue = () => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue, removeValue] as const
}
```

### **useDebounce Hook**

```typescript
// src/hooks/common/use-debounce.ts
import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
```

### **useIntersectionObserver Hook**

```typescript
// src/hooks/common/use-intersection-observer.ts
import { useEffect, useRef, useState } from 'react'

interface UseIntersectionObserverOptions {
  threshold?: number
  root?: Element | null
  rootMargin?: string
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {},
) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true)
        }
      },
      {
        threshold: options.threshold || 0,
        root: options.root || null,
        rootMargin: options.rootMargin || '0px',
      },
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [options.threshold, options.root, options.rootMargin, hasIntersected])

  return { ref, isIntersecting, hasIntersected }
}
```

## 🏪 Estado Global com Zustand

### **Product Store**

```typescript
// src/stores/product-store.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface Product {
  id: string
  name: string
  price: number
  category: string
  url: string
}

interface ProductState {
  products: Product[]
  selectedProduct: Product | null
  filters: {
    category?: string
    minPrice?: number
    maxPrice?: number
  }
  actions: {
    setProducts: (products: Product[]) => void
    addProduct: (product: Product) => void
    updateProduct: (id: string, product: Partial<Product>) => void
    removeProduct: (id: string) => void
    setSelectedProduct: (product: Product | null) => void
    setFilters: (filters: Partial<ProductState['filters']>) => void
    clearFilters: () => void
  }
}

export const useProductStore = create<ProductState>()(
  devtools(
    persist(
      (set, get) => ({
        products: [],
        selectedProduct: null,
        filters: {},
        actions: {
          setProducts: (products) => set({ products }),
          addProduct: (product) =>
            set((state) => ({
              products: [...state.products, product],
            })),
          updateProduct: (id, product) =>
            set((state) => ({
              products: state.products.map((p) =>
                p.id === id ? { ...p, ...product } : p,
              ),
            })),
          removeProduct: (id) =>
            set((state) => ({
              products: state.products.filter((p) => p.id !== id),
            })),
          setSelectedProduct: (product) => set({ selectedProduct: product }),
          setFilters: (filters) =>
            set((state) => ({
              filters: { ...state.filters, ...filters },
            })),
          clearFilters: () => set({ filters: {} }),
        },
      }),
      {
        name: 'product-store',
        partialize: (state) => ({
          products: state.products,
          filters: state.filters,
        }),
      },
    ),
    {
      name: 'product-store',
    },
  ),
)
```

### **UI Store**

```typescript
// src/stores/ui-store.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark' | 'system'
  notifications: Array<{
    id: string
    title: string
    description?: string
    type: 'info' | 'success' | 'warning' | 'error'
    timestamp: number
  }>
  actions: {
    toggleSidebar: () => void
    setSidebarOpen: (open: boolean) => void
    setTheme: (theme: UIState['theme']) => void
    addNotification: (
      notification: Omit<UIState['notifications'][0], 'id' | 'timestamp'>,
    ) => void
    removeNotification: (id: string) => void
    clearNotifications: () => void
  }
}

export const useUIStore = create<UIState>()(
  devtools(
    (set, get) => ({
      sidebarOpen: true,
      theme: 'system',
      notifications: [],
      actions: {
        toggleSidebar: () =>
          set((state) => ({
            sidebarOpen: !state.sidebarOpen,
          })),
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        setTheme: (theme) => set({ theme }),
        addNotification: (notification) =>
          set((state) => ({
            notifications: [
              ...state.notifications,
              {
                ...notification,
                id: Math.random().toString(36).substr(2, 9),
                timestamp: Date.now(),
              },
            ],
          })),
        removeNotification: (id) =>
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          })),
        clearNotifications: () => set({ notifications: [] }),
      },
    }),
    {
      name: 'ui-store',
    },
  ),
)
```

## 📚 Próximos Passos

1. **[Estilos](/docs/frontend/styling)** - Sistema de estilos e temas
2. **[Backend](/docs/backend/api-reference)** - Documentação da API
3. **[Matcher](/docs/matcher/overview)** - Serviço de matching

## 🆘 Precisa de Ajuda?

- **GitHub Issues**: [Reportar problemas](https://github.com/home-buddy/home-buddy-monorepo/issues)
- **Discord**: [Comunidade](https://discord.gg/home-buddy)
- **Email**: [suporte@homebuddy.com](mailto:suporte@homebuddy.com)
