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
          <main className="flex flex-col w-full h-screen overflow-hidden">
            <SidebarTrigger />
            {children}
          </main>
        </SidebarProvider>
      </AuthProvider>
    </>
  )
}
