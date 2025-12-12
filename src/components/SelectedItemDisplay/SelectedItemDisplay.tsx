import styles from "./SelectedItemDisplay.module.scss";
import { initialInventory } from "../../datas/initialData";
import { useVendingMachineContext } from "../../hooks/useVendingMachineContext";

function SelectedItemDisplay() {
  const {
    state: { selectedDrinkId },
  } = useVendingMachineContext();

  const selectedItem = initialInventory.find(
    (inventory) => inventory.id === selectedDrinkId
  );

  return (
    <div className={styles.container}>
      <p className={styles.name}>선택한 음료 : {selectedItem?.name || "-"}</p>
      <p className={styles.price}>가격 : {selectedItem?.price || 0}원</p>
    </div>
  );
}
export default SelectedItemDisplay;
