---
id: pages
title: Páginas e Roteamento
sidebar_position: 2
description: Estrutura de páginas e sistema de roteamento do Home Buddy
keywords: [páginas, roteamento, next.js, app router, home buddy]
---

# 📄 Páginas e Roteamento

O Home Buddy utiliza o App Router do Next.js 14 para gerenciar páginas e roteamento, proporcionando uma experiência moderna e otimizada.

## 🏗️ Estrutura de Páginas

### **Organização de Rotas**

```
src/app/
├── 📁 (auth)/                # Grupo de autenticação
│   ├── 📁 signin/           # /signin
│   │   └── 📄 page.tsx
│   └── 📁 signup/           # /signup
│       └── 📄 page.tsx
├── 📁 (private)/             # Grupo de rotas privadas
│   ├── 📁 dashboard/        # /dashboard
│   │   ├── 📄 page.tsx
│   │   └── 📄 loading.tsx
│   ├── 📁 products/         # /products
│   │   ├── 📄 page.tsx
│   │   ├── 📄 [id]/        # /products/[id]
│   │   │   └── 📄 page.tsx
│   │   └── 📄 new/         # /products/new
│   │       └── 📄 page.tsx
│   ├── 📁 analytics/        # /analytics
│   │   └── 📄 page.tsx
│   └── 📁 settings/         # /settings
│       └── 📄 page.tsx
├── 📁 (public)/              # Grupo de rotas públicas
│   ├── 📁 about/            # /about
│   │   └── 📄 page.tsx
│   └── 📁 pricing/          # /pricing
│       └── 📄 page.tsx
├── 📁 api/                   # API Routes
│   ├── 📁 auth/            # /api/auth
│   │   └── 📄 [...nextauth]/route.ts
│   └── 📁 products/        # /api/products
│       └── 📄 route.ts
├── 📄 layout.tsx            # Layout raiz
├── 📄 page.tsx              # Página inicial (/)
├── 📄 loading.tsx           # Loading global
├── 📄 error.tsx             # Error boundary global
└── 📄 not-found.tsx         # 404 page
```

## 🎨 Layouts e Templates

### **Layout Raiz**

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Home Buddy - Gestão Doméstica Inteligente',
  description: 'Sistema completo de gestão doméstica com rastreamento de produtos e comparação de preços',
  keywords: ['gestão doméstica', 'produtos', 'preços', 'rastreamento'],
  authors: [{ name: 'Home Buddy Team' }],
  openGraph: {
    title: 'Home Buddy',
    description: 'Gestão Doméstica Inteligente',
    type: 'website',
    locale: 'pt_BR',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
```

### **Layout Privado**

```typescript
// src/app/(private)/layout.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/signin')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <aside className="w-64 border-r bg-background">
          <Sidebar />
        </aside>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
```

### **Layout Público**

```typescript
// src/app/(public)/layout.tsx
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  )
}
```

## 🏠 Páginas Principais

### **Página Inicial**

```typescript
// src/app/page.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Package,
  BarChart3,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Gestão Doméstica{' '}
            <span className="text-primary">Inteligente</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Rastreie produtos, compare preços e gerencie seus gastos domésticos
            de forma inteligente com o Home Buddy.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" asChild>
              <Link href="/signin">
                Começar Agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/about">Saiba Mais</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Recursos Principais
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Tudo que você precisa para uma gestão doméstica eficiente
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <Package className="h-8 w-8 text-primary" />
                <CardTitle>Rastreamento</CardTitle>
                <CardDescription>
                  Monitore produtos em diferentes lojas
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-primary" />
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  Visualize seus gastos e padrões
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-primary" />
                <CardTitle>Seguro</CardTitle>
                <CardDescription>
                  Seus dados protegidos e privados
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 text-primary" />
                <CardTitle>Rápido</CardTitle>
                <CardDescription>
                  Interface moderna e responsiva
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Pronto para começar?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Junte-se a milhares de usuários que já economizam com o Home Buddy
          </p>
          <div className="mt-8">
            <Button size="lg" asChild>
              <Link href="/signin">
                Criar Conta Grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
```

### **Dashboard**

```typescript
// src/app/(private)/dashboard/page.tsx
import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { RecentProducts } from '@/components/dashboard/recent-products'
import { PriceAlerts } from '@/components/dashboard/price-alerts'
import { SpendingChart } from '@/components/dashboard/spending-chart'
import { LoadingSpinner } from '@/components/common/loading'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral dos seus produtos e gastos
        </p>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={<LoadingSpinner />}>
        <DashboardStats />
      </Suspense>

      {/* Charts and Data */}
      <div className="grid gap-6 md:grid-cols-2">
        <Suspense fallback={<LoadingSpinner />}>
          <SpendingChart />
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          <PriceAlerts />
        </Suspense>
      </div>

      {/* Recent Products */}
      <Suspense fallback={<LoadingSpinner />}>
        <RecentProducts />
      </Suspense>
    </div>
  )
}
```

### **Lista de Produtos**

```typescript
// src/app/(private)/products/page.tsx
import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProductList } from '@/components/products/product-list'
import { ProductFilters } from '@/components/products/product-filters'
import { LoadingSpinner } from '@/components/common/loading'
import { Plus, Search } from 'lucide-react'

interface ProductsPageProps {
  searchParams: {
    search?: string
    category?: string
    sort?: string
    page?: string
  }
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground">
            Gerencie seus produtos rastreados
          </p>
        </div>
        <Button asChild>
          <Link href="/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Produto
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar produtos..."
              defaultValue={searchParams.search || ''}
              className="pl-10"
            />
          </div>
        </div>
        <Select defaultValue={searchParams.category || ''}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as categorias</SelectItem>
            <SelectItem value="electronics">Eletrônicos</SelectItem>
            <SelectItem value="home">Casa e Jardim</SelectItem>
            <SelectItem value="clothing">Roupas</SelectItem>
            <SelectItem value="books">Livros</SelectItem>
            <SelectItem value="sports">Esportes</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue={searchParams.sort || 'name'}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Nome</SelectItem>
            <SelectItem value="price">Preço</SelectItem>
            <SelectItem value="date">Data de adição</SelectItem>
            <SelectItem value="category">Categoria</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Product List */}
      <Suspense fallback={<LoadingSpinner />}>
        <ProductList searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
```

### **Detalhes do Produto**

```typescript
// src/app/(private)/products/[id]/page.tsx
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProductDetails } from '@/components/products/product-details'
import { PriceHistory } from '@/components/products/price-history'
import { ProductMatches } from '@/components/products/product-matches'
import { LoadingSpinner } from '@/components/common/loading'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import { getProduct } from '@/lib/api/products'

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/products">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            <p className="text-muted-foreground">{product.category}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/products/${product.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </Button>
        </div>
      </div>

      {/* Product Details */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Suspense fallback={<LoadingSpinner />}>
            <ProductDetails product={product} />
          </Suspense>

          <Suspense fallback={<LoadingSpinner />}>
            <PriceHistory productId={product.id} />
          </Suspense>
        </div>

        <div className="space-y-6">
          <Suspense fallback={<LoadingSpinner />}>
            <ProductMatches productId={product.id} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
```

## 🔐 Páginas de Autenticação

### **Login**

```typescript
// src/app/(auth)/signin/page.tsx
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SignInForm } from '@/components/auth/signin-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/common/loading'

export default async function SignInPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Home Buddy</h1>
          <p className="mt-2 text-sm text-gray-600">
            Entre na sua conta para continuar
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Entrar</CardTitle>
            <CardDescription>
              Use sua conta Google para entrar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<LoadingSpinner />}>
              <SignInForm />
            </Suspense>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Ou continue com
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button variant="outline" className="w-full">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

## 🔄 Estados de Loading e Error

### **Loading Global**

```typescript
// src/app/loading.tsx
import { LoadingSpinner } from '@/components/common/loading'

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner />
    </div>
  )
}
```

### **Error Global**

```typescript
// src/app/error.tsx
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Algo deu errado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Ocorreu um erro inesperado. Tente recarregar a página.
          </p>
          <Button onClick={reset} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
```

### **404 Page**

```typescript
// src/app/not-found.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <CardTitle className="text-6xl font-bold text-primary">404</CardTitle>
          <CardTitle className="text-xl">Página não encontrada</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            A página que você está procurando não existe ou foi movida.
          </p>
          <div className="flex space-x-2">
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

## 🛣️ Navegação e Roteamento

### **Middleware de Autenticação**

```typescript
// src/middleware.ts
import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/products/:path*',
    '/analytics/:path*',
    '/settings/:path*',
  ],
}
```

### **Navegação Programática**

```typescript
// src/lib/navigation.ts
import { useRouter } from 'next/navigation'

export function useNavigation() {
  const router = useRouter()

  const navigateToProduct = (productId: string) => {
    router.push(`/products/${productId}`)
  }

  const navigateToProducts = (filters?: Record<string, string>) => {
    const params = new URLSearchParams(filters)
    const query = params.toString()
    router.push(`/products${query ? `?${query}` : ''}`)
  }

  const navigateToDashboard = () => {
    router.push('/dashboard')
  }

  return {
    navigateToProduct,
    navigateToProducts,
    navigateToDashboard,
  }
}
```

## 📱 Responsividade

### **Breakpoints**

```typescript
// src/lib/responsive.ts
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}

export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState('lg')

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) setScreenSize('sm')
      else if (width < 768) setScreenSize('md')
      else if (width < 1024) setScreenSize('lg')
      else if (width < 1280) setScreenSize('xl')
      else setScreenSize('2xl')
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return screenSize
}
```

## 📚 Próximos Passos

1. **[Hooks](/docs/frontend/hooks)** - Custom hooks e gerenciamento de estado
2. **[Estilos](/docs/frontend/styling)** - Sistema de estilos e temas
3. **[Backend](/docs/backend/api-reference)** - Documentação da API

## 🆘 Precisa de Ajuda?

- **GitHub Issues**: [Reportar problemas](https://github.com/home-buddy/home-buddy-monorepo/issues)
- **Discord**: [Comunidade](https://discord.gg/home-buddy)
- **Email**: [suporte@homebuddy.com](mailto:suporte@homebuddy.com)
