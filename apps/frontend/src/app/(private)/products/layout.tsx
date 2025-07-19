export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Produtos</h1>
      {children}
    </section>
  )
} 