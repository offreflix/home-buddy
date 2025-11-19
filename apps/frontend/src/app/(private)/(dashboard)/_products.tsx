import { Card, CardContent, CardHeader } from '@/components/ui/card'

export const LoadingProductCard = ({
  children,
  className,
}: {
  className?: string
  children: React.ReactNode
}) => {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        {children}
      </CardHeader>
      <CardContent>
        <div className="h-8 w-24 bg-muted rounded-md animate-pulse" />
        <div className="mt-2 h-4 w-40 bg-muted rounded-md animate-pulse" />
      </CardContent>
    </Card>
  )
}
