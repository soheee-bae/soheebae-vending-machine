import { useMemo, type ReactNode } from "react";
import { useVendingMachine } from "../hooks/useVendingMachine";
import { VendingMachineContext } from "./VendingMachineContext";

export function VendingMachineProvider({ children }: { children: ReactNode }) {
  const { state, actions, isSelectable } = useVendingMachine();
  const contextValue = useMemo(
    () => ({ state, actions, isSelectable }),
    [state, actions, isSelectable]
  );
  return (
    <VendingMachineContext.Provider value={contextValue}>
      {children}
    </VendingMachineContext.Provider>
  );
}
