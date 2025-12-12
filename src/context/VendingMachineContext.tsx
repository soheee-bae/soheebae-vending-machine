import { createContext } from "react";
import { useVendingMachine } from "../hooks/useVendingMachine";
import type { VendingMachine } from "../types/machine";
import { initialState } from "../datas/initialData";

export interface VendingMachineContextType {
  state: VendingMachine;
  actions: ReturnType<typeof useVendingMachine>["actions"] | null;
  isSelectable: (price: number, stock: number) => boolean;
}

export const VendingMachineContext = createContext<VendingMachineContextType>({
  state: initialState,
  actions: null,
  isSelectable: () => false,
});
