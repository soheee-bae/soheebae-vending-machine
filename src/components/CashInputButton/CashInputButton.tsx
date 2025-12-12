import styles from "./CashInputButton.module.scss";
import Button from "../Button/Button";
import { useVendingMachineContext } from "../../hooks/useVendingMachineContext";

const CASH: number[] = [100, 500, 1000, 5000, 10000];

function CashInputButton() {
  const { actions } = useVendingMachineContext();

  return (
    <div className={styles.container}>
      <p className={styles.title}>현금</p>
      <div className={styles.cards}>
        {CASH.map((cash) => {
          const cashAmount = cash.toLocaleString("ko-KR");
          return (
            <Button
              key={cash}
              label={`${cashAmount}원`}
              size="sm"
              onClick={() => {
                actions?.insertMoney(cash);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
export default CashInputButton;
