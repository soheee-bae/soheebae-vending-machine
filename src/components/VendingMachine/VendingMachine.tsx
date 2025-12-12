import { DisplayPanel, ControlPanel } from "..";
import styles from "./VendingMachine.module.scss";

function VendingMachine() {
  return (
    <div className={styles.container}>
      <DisplayPanel />
      <div className={styles.divider} />
      <ControlPanel />
    </div>
  );
}
export default VendingMachine;
