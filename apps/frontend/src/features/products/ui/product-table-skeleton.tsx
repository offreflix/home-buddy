import { Skeleton } from "@/components/ui/skeleton";
import {
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";

export function DataTableSkeleton() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="text-muted-foreground">
            <TableCell className="px-6">Nome</TableCell>
            <TableCell className="px-6">Quantidade</TableCell>
            <TableCell className="px-6">Categoria</TableCell>
            <TableCell />
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map(() => (
            <TableRow key={crypto.randomUUID()}>
              <TableCell>
                <div className="pl-4">
                  <Skeleton className="h-4 w-[75px] sm:w-[100px] md:w-[150px] lg:w-[200px]" />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2 pl-4">
                  <div className="w-[100px] space-y-1">
                    <Skeleton className="h-2 w-full" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </TableCell>
              <TableCell>
                <div className="pl-4">
                  <Skeleton className="h-4 w-[80px]" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-8 rounded-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
