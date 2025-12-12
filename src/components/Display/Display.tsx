import styles from "./Display.module.scss";

import { useVendingMachineContext } from "../../hooks/useVendingMachineContext";
import Tag from "../Tag/Tag";
import CashEntries from "../CashEntries/CashEntries";

function Display() {
  const { state } = useVendingMachineContext();

  const mode = state.isCardReady
    ? "CARD MODE"
    : state.isCashReady
    ? "CASH MODE"
    : "";

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.tags}>
          <Tag label={state.currentState} />
          <Tag label={mode} />
        </div>
        <p className={styles.balance}>Balance : {state.currentBalance}원</p>
        <p className={styles.message}>{state.message}</p>
      </div>
      <CashEntries />
    </div>
  );
}
export default Display;
