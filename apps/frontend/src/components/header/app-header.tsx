'use client'

import { useAuth } from '@/context/auth/context'
import { ThemeToggle } from '../theme-toggle'
import { Breadcrumbs } from './breadcrumbs'
import { SystemStatus } from './system-status'
import { GlobalSearch } from './global-search'
import { NotificationsDropdown } from './notifications-dropdown'
import { UserProfileDropdown } from './user-profile-dropdown'
import { QuickActions } from './quick-actions'

export function AppHeader() {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Lado esquerdo - Breadcrumbs e status */}
        <div className="flex items-center gap-4">
          {/* Breadcrumbs */}
          <Breadcrumbs className="text-muted-foreground" />

          {/* Status do sistema */}
          <SystemStatus />
        </div>

        {/* Centro - Barra de busca global */}
        <div className="flex-1 flex justify-center max-w-2xl mx-4">
          <GlobalSearch />
        </div>

        {/* Lado direito - Ações rápidas, notificações, tema e perfil */}
        <div className="flex items-center gap-1">
          {/* Ações rápidas */}
          <div className="hidden lg:flex items-center gap-2">
            <QuickActions />
          </div>

          {/* Notificações */}
          <NotificationsDropdown />

          {/* Toggle de tema */}
          <ThemeToggle />

          {/* Perfil do usuário */}
          <UserProfileDropdown />
        </div>
      </div>
    </header>
  )
}
