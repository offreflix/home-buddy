'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Home,
  ShoppingBasket,
  Upload,
  LayoutDashboard,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
}

const getBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) {
    return [{ label: 'Dashboard', icon: LayoutDashboard }]
  }

  const breadcrumbs: BreadcrumbItem[] = []

  const segmentMap: Record<
    string,
    { label: string; icon?: React.ComponentType<{ className?: string }> }
  > = {
    products: { label: 'Produtos', icon: ShoppingBasket },
    scraping: { label: 'Scraping', icon: Upload },
    dashboard: { label: 'Dashboard', icon: LayoutDashboard },
  }

  let currentPath = ''
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const segmentInfo = segmentMap[segment] || {
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
    }

    breadcrumbs.push({
      label: segmentInfo.label,
      href: index === segments.length - 1 ? undefined : currentPath,
      icon: segmentInfo.icon,
    })
  })

  return breadcrumbs
}

interface BreadcrumbsProps {
  className?: string
}

export function Breadcrumbs({ className }: BreadcrumbsProps) {
  const pathname = usePathname()
  const breadcrumbs = getBreadcrumbs(pathname)

  return (
    <nav className={cn('flex items-center space-x-1 text-sm', className)}>
      {/* Home sempre visível */}
      <Link
        href="/"
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
        <span className="hidden sm:inline">Home</span>
      </Link>

      {/* Separador */}
      <ChevronRight className="h-4 w-4 text-muted-foreground" />

      {/* Breadcrumbs dinâmicos */}
      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center">
          {item.href ? (
            <Link
              href={item.href}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.icon && <item.icon className="h-4 w-4" />}
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          ) : (
            <span className="flex items-center gap-1 text-foreground font-medium">
              {item.icon && <item.icon className="h-4 w-4" />}
              <span className="hidden sm:inline">{item.label}</span>
            </span>
          )}

          {/* Separador entre itens */}
          {index < breadcrumbs.length - 1 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground ml-1" />
          )}
        </div>
      ))}
    </nav>
  )
}
