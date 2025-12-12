import { useMemo, type ReactNode } from "react";
import { useVendingMachine } from "../hooks/useVendingMachine";
import { VendingMachineContext } from "./VendingMachineContext";

export function VendingMachineProvider({ children }: { children: ReactNode }) {
  const { state, actions, isSelectable, isCashMode, isCardMode, isLoading } =
    useVendingMachine();
  const contextValue = useMemo(
    () => ({ state, actions, isSelectable, isCashMode, isCardMode, isLoading }),
    [state, actions, isSelectable, isCashMode, isCardMode, isLoading]
  );
  return (
    <VendingMachineContext.Provider value={contextValue}>
      {children}
    </VendingMachineContext.Provider>
  );
}
