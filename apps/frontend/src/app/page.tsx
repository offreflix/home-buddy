"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CarTaxiFront,
  Lock,
  Minus,
  Package,
  ShoppingBag,
  Square,
  Utensils,
  X,
} from "lucide-react";
import axios from "axios";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Category, Unit, type Product } from "@/features/products/model/types";
import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/features/products/api/product-api";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: productApi.getAllProducts,
  });

  const data = {
    totalProducts: 1500,
    totalProductsLastMonth: 1400,
    productsInShortage: 45,
    mostConsumedProduct: {
      name: "Farinha de Trigo",
      quantity: 320,
      unit: "kg",
      quantityLastMonth: 290,
    },
    totalProductsChange: 7.14,
    shortageChange: 5,
    consumptionChange: 10.34,
  };

  console.log(productsQuery);

  function PercentageChange({ value }: { value: number }) {
    if (value === 0) return null;
    const Icon = value > 0 ? ArrowUp : ArrowDown;
    return (
      <span
        className={`flex items-center ${
          value > 0 ? "text-green-500" : "text-red-500"
        }`}
      >
        <Icon className="w-4 h-4 mr-1" />
        {Math.abs(value).toFixed(1)}%
      </span>
    );
  }

  return (
    <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Produtos
          </CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalProducts}</div>
          {data.totalProductsLastMonth > 0 ? (
            <CardDescription className="flex items-center text-xs">
              <PercentageChange value={data.totalProductsChange} />
              <span className="ml-1">em relação ao mês passado</span>
            </CardDescription>
          ) : (
            <CardDescription>Sem comparação disponível</CardDescription>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Produtos em Falta
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.productsInShortage}</div>
          {data.productsInShortage > 0 ? (
            <CardDescription className="flex items-center text-xs">
              <PercentageChange value={-data.shortageChange} />
              <span className="ml-1">em relação ao mês passado</span>
            </CardDescription>
          ) : (
            <CardDescription>Sem produtos em falta</CardDescription>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Produto Mais Consumido
          </CardTitle>
          <Utensils className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.mostConsumedProduct.name}
          </div>
          <CardDescription className="text-xs">
            {data.mostConsumedProduct.quantity} {data.mostConsumedProduct.unit}{" "}
            consumidos
          </CardDescription>
          {data.mostConsumedProduct.quantityLastMonth > 0 ? (
            <CardDescription className="flex items-center text-xs">
              <PercentageChange value={data.consumptionChange} />
              <span className="ml-1">em relação ao mês passado</span>
            </CardDescription>
          ) : (
            <CardDescription>Sem comparação disponível</CardDescription>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
