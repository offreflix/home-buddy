import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Minus, MoreHorizontal, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import type { Product } from "../model/types";
import { useModalStore } from "../stores/modal.store";
import { productIndexedDbService } from "../api/indexed-db.service";
import { useQueryClient } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="pl-4">{row.getValue("name")}</div>,
  },

  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantidade
          <ArrowUpDown />
        </Button>
      );
    },

    cell: ({ row }) => {
      const queryClient = useQueryClient();

      return (
        <div className="flex items-center space-x-2 pl-4">
          <div className="w-[100px] space-y-1">
            <Progress
              value={
                (row.original.currentQuantity / row.original.desiredQuantity) *
                100
              }
            />
            <div className="text-xs text-muted-foreground">
              {row.original.currentQuantity} / {row.original.desiredQuantity}{" "}
              {row.original.unit}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={async () => {
              await productIndexedDbService.decreaseQuantity(row.original.id);

              queryClient.invalidateQueries({ queryKey: ["products"] });
            }}
          >
            <Minus />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={async () => {
              await productIndexedDbService.addQuantity(row.original.id);

              queryClient.invalidateQueries({ queryKey: ["products"] });
            }}
          >
            <Plus />
          </Button>
        </div>
      );
    },
  },

  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Categoria
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="pl-4">
        <Badge variant="secondary" className="text-xs">
          {row.getValue("category")}
        </Badge>
      </div>
    ),
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const {
        toggleEditModal,
        setEditingProduct,
        toggleDeleteModal,
        setDeletingProductId,
      } = useModalStore();

      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 w-9 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                toggleEditModal();
                setEditingProduct(row.original);
              }}
            >
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                toggleDeleteModal();
                setDeletingProductId(row.original.id);
              }}
            >
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
