'use client'

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-16 w-16 animate-spin rounded-full border-4 border-muted border-t-primary" />
        <div className="text-xl font-medium">Carregando...</div>
      </div>
    </div>
  )
}
