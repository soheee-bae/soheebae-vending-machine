import styles from "./Display.module.scss";
import { useVendingMachineContext } from "../../hooks/useVendingMachineContext";
import { Tag, CashEntries } from "..";

function Display() {
  const { state, isCardMode, isCashMode } = useVendingMachineContext();
  const mode = isCardMode ? "CARD MODE" : isCashMode ? "CASH MODE" : "";
  const currentAmont = state.currentBalance.toLocaleString("ko-KR");

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.tags}>
          <Tag label={state.currentState} />
          <Tag label={mode} />
        </div>
        <p className={styles.balance}>잔액 : {currentAmont}원</p>
        <p className={styles.message}>{state.message}</p>
      </div>
      <CashEntries />
    </div>
  );
}
export default Display;
