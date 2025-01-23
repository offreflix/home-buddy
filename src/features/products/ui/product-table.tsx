'use client'

import * as React from 'react'
import {
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronDown, PlusCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { columns } from './columns'

// const data: Product[] = [
//   {
//     id: '1',
//     name: 'Arroz Branco',
//     currentQuantity: 5,
//     desiredQuantity: 10,
//     unit: 'kg',
//     category: 'Grãos',
//   },
//   {
//     id: '2',
//     name: 'Açúcar Refinado',
//     currentQuantity: 1500,
//     desiredQuantity: 3000,
//     unit: 'g',
//     category: 'Açúcar',
//   },
//   {
//     id: '3',
//     name: 'Farinha de Trigo',
//     currentQuantity: 2,
//     desiredQuantity: 5,
//     unit: 'kg',
//     category: 'Farinhas',
//   },
//   {
//     id: '4',
//     name: 'Leite em Pó',
//     currentQuantity: 800,
//     desiredQuantity: 2000,
//     unit: 'g',
//     category: 'Laticínios',
//   },
//   {
//     id: '5',
//     name: 'Feijão Preto',
//     currentQuantity: 3,
//     desiredQuantity: 7,
//     unit: 'kg',
//     category: 'Grãos',
//   },
//   {
//     id: '6',
//     name: 'Macarrão Espaguete',
//     currentQuantity: 4,
//     desiredQuantity: 8,
//     unit: 'kg',
//     category: 'Massas',
//   },
//   {
//     id: '7',
//     name: 'Óleo de Soja',
//     currentQuantity: 2,
//     desiredQuantity: 4,
//     unit: 'L',
//     category: 'Óleos',
//   },
//   {
//     id: '8',
//     name: 'Café em Pó',
//     currentQuantity: 500,
//     desiredQuantity: 1000,
//     unit: 'g',
//     category: 'Bebidas',
//   },
//   {
//     id: '9',
//     name: 'Sal Refinado',
//     currentQuantity: 1,
//     desiredQuantity: 3,
//     unit: 'kg',
//     category: 'Temperos',
//   },
//   {
//     id: '10',
//     name: 'Milho em Conserva',
//     currentQuantity: 2,
//     desiredQuantity: 5,
//     unit: 'lata',
//     category: 'Conservas',
//   },
//   {
//     id: '11',
//     name: 'Creme de Leite',
//     currentQuantity: 3,
//     desiredQuantity: 6,
//     unit: 'lata',
//     category: 'Laticínios',
//   },
//   {
//     id: '12',
//     name: 'Azeite de Oliva',
//     currentQuantity: 1,
//     desiredQuantity: 2,
//     unit: 'L',
//     category: 'Óleos',
//   },
//   {
//     id: '13',
//     name: 'Biscoito de Maizena',
//     currentQuantity: 3,
//     desiredQuantity: 6,
//     unit: 'pacote',
//     category: 'Snacks',
//   },
//   {
//     id: '14',
//     name: 'Batata Palha',
//     currentQuantity: 2,
//     desiredQuantity: 4,
//     unit: 'pacote',
//     category: 'Snacks',
//   },
//   {
//     id: '15',
//     name: 'Achocolatado em Pó',
//     currentQuantity: 800,
//     desiredQuantity: 1600,
//     unit: 'g',
//     category: 'Bebidas',
//   },
//   {
//     id: '16',
//     name: 'Fermento Químico',
//     currentQuantity: 500,
//     desiredQuantity: 1000,
//     unit: 'g',
//     category: 'Farinhas',
//   },
//   {
//     id: '17',
//     name: 'Leite Condensado',
//     currentQuantity: 2,
//     desiredQuantity: 5,
//     unit: 'lata',
//     category: 'Laticínios',
//   },
//   {
//     id: '18',
//     name: 'Chocolate em Barra',
//     currentQuantity: 1,
//     desiredQuantity: 3,
//     unit: 'kg',
//     category: 'Doces',
//   },
//   {
//     id: '19',
//     name: 'Ervilha em Conserva',
//     currentQuantity: 2,
//     desiredQuantity: 5,
//     unit: 'lata',
//     category: 'Conservas',
//   },
//   {
//     id: '20',
//     name: 'Molho de Tomate',
//     currentQuantity: 5,
//     desiredQuantity: 10,
//     unit: 'pacote',
//     category: 'Conservas',
//   },
// ]

export const getProductsFromLocalStorageAPI = (): Promise<Product[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const storedData = localStorage.getItem('products')
        const products = storedData ? JSON.parse(storedData).reverse() : []
        resolve(products)
      } catch (error) {
        console.error('Error parsing products from localStorage', error)
        reject(new Error('Failed to retrieve products from localStorage'))
      }
    }, 1000)
  })
}

export interface Product {
  id: string
  name: string
  currentQuantity: number
  desiredQuantity: number
  unit: 'kg' | 'g' | 'L' | 'lata' | 'pacote'
  category: string
}

import { useQuery } from '@tanstack/react-query'
import { DialogDemo } from './create-product-dialog'

export function DataTableDemo() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: getProductsFromLocalStorageAPI,
  })

  const table = useReactTable({
    data: productsQuery.data ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  console.log(productsQuery)

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold">
          Produtos
          {table.getIsSomePageRowsSelected() && (
            <span className="text-sm text-muted-foreground">
              {' '}
              - {table.getFilteredSelectedRowModel().rows.length} selecionado(s)
            </span>
          )}
        </p>
        <DialogDemo />
        {/* <Button>
          <PlusCircle />
          Adicionar Produto
        </Button> */}
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Filtrar nome..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {productsQuery.isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
