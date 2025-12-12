import { useVendingMachineContext } from "../../hooks/useVendingMachineContext";
import { MachineState } from "../../types/machine";
import styles from "./DispenseArea.module.scss";

function DispenseArea() {
  const { state } = useVendingMachineContext();
  const selectedDrink =
    state.selectedDrinkId && state.currentState !== MachineState.READY
      ? state.inventory.find((item) => item.id === state.selectedDrinkId)
      : null;

  const isDispensing =
    state.currentState === MachineState.DISPENSING ||
    state.currentState === MachineState.RETURNING_CHANGE;

  return (
    <div className={styles.container}>
      <p>상품 나오는 곳</p>
      <div className={styles.box}>
        {isDispensing && selectedDrink && (
          <div className={styles.dispensedProduct}>
            <div className={styles.productIcon}>{selectedDrink.icon}</div>
          </div>
        )}
      </div>
    </div>
  );
}
export default DispenseArea;
