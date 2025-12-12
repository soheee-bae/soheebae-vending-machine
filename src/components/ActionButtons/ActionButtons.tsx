import styles from "./ActionButtons.module.scss";
import { Button } from "..";
import { useVendingMachineContext } from "../../hooks/useVendingMachineContext";
import { MachineState } from "../../types/machine";

function ActionButtons() {
  const { actions, state, isLoading } = useVendingMachineContext();

  const disableCardPayment =
    state.currentState === MachineState.CASH_PAYMENT ||
    state.isCashReady ||
    isLoading;
  const disableRetutningChange =
    state.currentState === MachineState.CARD_PAYMENT ||
    state.isCardReady ||
    state.currentBalance === 0 ||
    isLoading;

  return (
    <div className={styles.container}>
      <Button
        label="카드 결제"
        disabled={disableCardPayment}
        onClick={() => actions?.startCardPayment()}
      />
      <Button
        disabled={disableRetutningChange}
        label="잔돈 받기"
        onClick={() => {
          actions?.requestReturnChange();
        }}
      />
    </div>
  );
}
export default ActionButtons;
