import type { Metadata } from 'next'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { AppHeader } from '@/components/header/app-header'
import { NotificationListener } from '@/components/notification-listener'
import { AuthProvider } from '@/context/auth/context'
import { getAppVersion } from '../action/version'
import { CreateProductDialog } from './products/ui/modal/create-product-dialog'

export const metadata: Metadata = {
  title: 'Home Buddy',
  description: 'O seu app de gestão de produtos e estoque',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const version = await getAppVersion()
  return (
    <>
      <AuthProvider>
        <SidebarProvider>
          <div className="flex h-screen overflow-hidden">
            <AppSidebar version={version} />
            <div className="flex flex-col flex-1 min-w-0">
              <AppHeader />
              <main className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto">
                  <div className="container mx-auto px-4 py-6 max-w-7xl">
                    {children}
                  </div>
                </div>
              </main>
            </div>
          </div>

          {/* Modal global para criação de produtos */}
          <CreateProductDialog />
          <NotificationListener />
        </SidebarProvider>
      </AuthProvider>
    </>
  )
}
