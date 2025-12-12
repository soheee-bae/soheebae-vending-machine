import { Coffee } from "../icons/coffee";
import { Coke } from "../icons/coke";
import { Water } from "../icons/water";
import type { Cash } from "../types/cash";
import type { DrinkItem } from "../types/items";
import { MachineState, type VendingMachine } from "../types/machine";

export const initialInventory: DrinkItem[] = [
  { id: "coke", name: "콜라", price: 1100, stock: 5, icon: <Coke /> },
  { id: "water", name: "물", price: 600, stock: 10, icon: <Water /> },
  { id: "coffee", name: "커피", price: 700, stock: 0, icon: <Coffee /> },
];

export const initialRemainingCash: Cash = {
  10000: 5,
  5000: 2,
  1000: 10,
  500: 5,
  100: 15,
};

export const initialState: VendingMachine = {
  currentState: MachineState.READY,
  currentBalance: 0,
  price: 0,
  selectedDrinkId: null,
  isCardReady: false,
  isCashReady: false,
  inventory: initialInventory,
  remainingCash: initialRemainingCash,
  message: "현금을 투입하거나 카드를 선택하세요.",
};

export const CashList: number[] = [10000, 5000, 1000, 500, 100];
