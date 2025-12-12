import type { ReactNode } from "react";

type DrinkItemNames = "콜라" | "물" | "커피";
type DrinkItemIds = "coke" | "water" | "coffee";

export interface DrinkItem {
  id: DrinkItemIds;
  name: DrinkItemNames;
  price: number;
  stock: number;
  icon: ReactNode;
}
