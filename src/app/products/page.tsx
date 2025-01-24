import { DataTableDemo } from '@/features/products/ui/product-table'
import Link from 'next/link'

export default function Page() {
  return (
    <div className="p-8 flex flex-col gap-4">
      <Link href="/">Home</Link>
      <DataTableDemo />
    </div>
  )
}
