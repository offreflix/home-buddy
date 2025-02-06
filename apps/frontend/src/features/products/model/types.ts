export enum Unit {
  kg = "kg",
  g = "g",
  L = "L",
  lata = "lata",
  pacote = "pacote",
  unidade = "unidade",
}

export enum Category {
  Frutas = "Frutas",
  Verduras = "Verduras",
  Carnes = "Carnes",
}

export interface Product {
  id: string;
  name: string;
  currentQuantity: number;
  desiredQuantity: number;
  unit: Unit;
  category: Category;
}
