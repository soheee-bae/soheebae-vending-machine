import type { Cash } from "./cash";
import type { DrinkItem } from "./items";

export const MachineState = {
  READY: "READY",
  CASH_PAYMENT: "CASH_PAYMENT",
  CARD_PAYMENT: "CARD_PAYMENT",
  READY_TO_SELECT: "READY_TO_SELECT",
  PROCESSING: "PROCESSING",
  DISPENSING: "DISPENSING",
  RETURNING_CHANGE: "RETURNING_CHANGE",
  ERROR: "ERROR",
} as const;

export type MachineState = (typeof MachineState)[keyof typeof MachineState];

export interface VendingMachine {
  currentState: MachineState;
  currentBalance: number;
  price: number;
  isCardReady: boolean;
  isCashReady: boolean;
  inventory: DrinkItem[];
  remainingCash: Cash;
  message: string;
  selectedDrinkId: string | null;
  //   activeDrinks: DrinkItem[];
}

export type VendingMachineAction =
  | { type: "INSERT_CASH"; payload: { insertedAmount: number } }
  | { type: "START_CARD_PAYMENT" }
  | { type: "CARD_PAYMENT_SUCCESS" }
  | { type: "CARD_PAYMENT_FAILURE" }
  | { type: "SELECT_DRINK"; payload: string }
  | { type: "PROCESS_PURCHASE"; payload: { selectedDrink: DrinkItem } }
  | { type: "COMPLETE_DISPENSING" }
  | { type: "RETURN_REQUEST" }
  | { type: "COMPLETE_CHANGE_RETURN" }
  | { type: "CHANGE_INSUFFICIENT" }
  | { type: "SET_ERROR"; payload: string }
  | { type: "RESET_STATE" }
  | { type: "CHECK_ACTIVE_ITEM" };
