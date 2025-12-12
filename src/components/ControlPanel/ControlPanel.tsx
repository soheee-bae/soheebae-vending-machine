import styles from "./ControlPanel.module.scss";

import { DispenseArea, ActionButtons, CashInputButton } from "..";

function ControlPanel() {
  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <CashInputButton />
        <ActionButtons />
      </div>
      <DispenseArea />
    </div>
  );
}
export default ControlPanel;
