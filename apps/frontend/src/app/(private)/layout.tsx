import type { Metadata } from 'next'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { AuthProvider } from '@/context/auth/context'
import { getAppVersion } from '../action/version'

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
          <AppSidebar version={version} />
          <main className="flex flex-col w-full min-h-screen">
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
              <SidebarTrigger />
            </div>
            <div className="flex-1 overflow-y-auto">{children}</div>
          </main>
        </SidebarProvider>
      </AuthProvider>
    </>
  )
}
