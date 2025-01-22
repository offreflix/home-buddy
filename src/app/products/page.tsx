import { DataTableDemo } from '@/features/products/ui/product-table'
import Link from 'next/link'

export default function Page() {
  return (
    <div className="p-8 flex flex-col gap-4">
      <h1>Home</h1>
      <Link href="/about">About</Link>
      <DataTableDemo />
    </div>
  )
}
