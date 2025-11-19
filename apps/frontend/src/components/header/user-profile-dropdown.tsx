'use client'

import { useState } from 'react'
import {
  User,
  Settings,
  CreditCard,
  Bell,
  LogOut,
  Shield,
  HelpCircle,
  Palette,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/context/auth/context'
import { logout } from '@/features/auth/model/authActions'
import { ThemeToggle } from '../theme-toggle'
import { UserProfileModal } from './user-profile-modal'

interface UserProfileDropdownProps {
  className?: string
}

export function UserProfileDropdown({ className }: UserProfileDropdownProps) {
  const { user } = useAuth()
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  const handleLogout = () => {
    logout()
  }

  const handleOpenProfile = () => {
    setIsProfileModalOpen(true)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 h-9 px-3">
            <Avatar className="h-7 w-7">
              <AvatarImage
                referrerPolicy="no-referrer"
                src={user?.picture}
                alt={user?.username}
              />
              <AvatarFallback>
                {user?.username?.slice(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="hidden md:block text-sm font-medium">
              {user?.username || 'Usuário'}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          {/* Cabeçalho com informações do usuário */}
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-3 px-2 py-3 text-left">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  referrerPolicy="no-referrer"
                  src={user?.picture}
                  alt={user?.username}
                />
                <AvatarFallback className="text-lg">
                  {user?.username?.slice(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-base">
                  {user?.username || 'Usuário'}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user?.email || 'usuario@exemplo.com'}
                </span>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600 font-medium">
                    Online
                  </span>
                </div>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* Ações principais */}
          <DropdownMenuItem
            className="flex items-center gap-2 p-2"
            onClick={handleOpenProfile}
          >
            <User className="h-4 w-4" />
            <div className="flex flex-col">
              <span>Meu Perfil</span>
              <span className="text-xs text-muted-foreground">
                Gerenciar informações pessoais
              </span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-2 p-2">
            <Settings className="h-4 w-4" />
            <div className="flex flex-col">
              <span>Configurações</span>
              <span className="text-xs text-muted-foreground">
                Preferências da conta
              </span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Configurações avançadas */}
          <DropdownMenuItem className="flex items-center gap-2 p-2">
            <Shield className="h-4 w-4" />
            <div className="flex flex-col">
              <span>Privacidade</span>
              <span className="text-xs text-muted-foreground">
                Controle de dados e segurança
              </span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-2 p-2">
            <CreditCard className="h-4 w-4" />
            <div className="flex flex-col">
              <span>Assinatura</span>
              <span className="text-xs text-muted-foreground">
                Planos e pagamentos
              </span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-2 p-2">
            <Bell className="h-4 w-4" />
            <div className="flex flex-col">
              <span>Notificações</span>
              <span className="text-xs text-muted-foreground">
                Preferências de alertas
              </span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Ajuda e suporte */}
          <DropdownMenuItem className="flex items-center gap-2 p-2">
            <HelpCircle className="h-4 w-4" />
            <div className="flex flex-col">
              <span>Ajuda & Suporte</span>
              <span className="text-xs text-muted-foreground">
                Central de ajuda e contato
              </span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Toggle de tema */}
          <ThemeToggle>
            <DropdownMenuItem className="flex items-center gap-2 p-2">
              <Palette className="h-4 w-4" />
              <div className="flex flex-col">
                <span>Alternar Tema</span>
                <span className="text-xs text-muted-foreground">
                  Claro/escuro
                </span>
              </div>
            </DropdownMenuItem>
          </ThemeToggle>

          <DropdownMenuSeparator />

          {/* Logout */}
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center gap-2 p-2 text-red-600 focus:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            <div className="flex flex-col">
              <span>Sair</span>
              <span className="text-xs text-red-500">Encerrar sessão</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal do perfil */}
      <UserProfileModal
        open={isProfileModalOpen}
        onOpenChange={setIsProfileModalOpen}
      />
    </>
  )
}
