import { useContext } from "react";
import { VendingMachineContext } from "../context/VendingMachineContext";

export function useVendingMachineContext() {
  const context = useContext(VendingMachineContext);
  if (context === undefined) {
    throw new Error(
      "useVendingMachineContext는 VendingMachineProvider 내에서 사용되어야 합니다."
    );
  }
  return context;
}
